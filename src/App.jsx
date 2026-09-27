import { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import ResultsSection from './components/ResultsSection';
import Timer from './components/Timer';
import Dashboard from './components/Dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalyze(formData) {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (err) {
      const message = err?.response?.data?.detail || 'Something went wrong while generating your study pack.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />

      {currentPage === 'home' && (
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <UploadSection onAnalyze={handleAnalyze} loading={loading} error={error} />
            <ResultsSection result={result} loading={loading} />
          </div>
        </main>
      )}

      {currentPage === 'dashboard' && <Dashboard />}

      <Timer />
    </div>
  );
}
