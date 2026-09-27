# StudyFlow AI

A polished AI-powered study assistant that turns notes or PDFs into summaries, flashcards, and quizzes.

## Stack
- React + Vite + Tailwind
- FastAPI
- OpenAI GPT
- PDF parsing with PyPDF

## Run locally

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# add your OpenAI API key
python app.py
```

### Frontend
```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Notes
- The frontend calls the backend at http://localhost:8000/api/analyze
- Paste notes or upload a PDF to generate a study pack
