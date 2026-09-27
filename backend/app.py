from typing import Optional
import json
import io
import os

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import pypdf

load_dotenv()

app = FastAPI(title='StudyFlow AI')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


def extract_pdf_text(file_bytes: bytes) -> str:
    try:
        pdf = pypdf.PdfReader(io.BytesIO(file_bytes))
        pages = [page.extract_text() or '' for page in pdf.pages]
        return '\n'.join(pages)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f'Failed to read PDF: {exc}') from exc


def generate_study_pack(content: str) -> dict:
    if not content.strip():
        raise HTTPException(status_code=400, detail='No notes provided.')

    prompt = f"""
You are an expert study assistant. Read the material and return valid JSON only.
Format:
{
  "summary": "brief summary",
  "flashcards": [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ],
  "quiz": [
    {"question": "...", "options": ["A","B","C","D"], "answer": "A"}
  ]
}

Study material:
{content[:5000]}
"""

    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=[
            {
                'role': 'system',
                'content': 'You create educational summaries, flashcards, and multiple-choice quizzes. Return valid JSON only.'
            },
            {'role': 'user', 'content': prompt},
        ],
        temperature=0.7,
        max_tokens=2000,
    )

    text = response.choices[0].message.content
    if '```json' in text:
        text = text.split('```json', 1)[1].split('```', 1)[0].strip()
    elif '```' in text:
        text = text.split('```', 1)[1].split('```', 1)[0].strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=500, detail=f'AI output was not valid JSON: {exc}') from exc


@app.get('/')
async def welcome():
    return {'message': 'StudyFlow AI backend is running.'}


@app.get('/health')
async def health():
    return {'status': 'ok'}


@app.post('/api/analyze')
async def analyze(
    notes: Optional[str] = Form(default=''),
    file: Optional[UploadFile] = File(default=None),
):
    content = notes.strip() if notes else ''

    if file:
        file_bytes = await file.read()
        filename = file.filename.lower() if file.filename else ''

        if filename.endswith('.pdf'):
            content = extract_pdf_text(file_bytes) + ('\n' + content if content else '')
        else:
            text = file_bytes.decode('utf-8', errors='ignore')
            content = text + ('\n' + content if content else '')

    return generate_study_pack(content)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
