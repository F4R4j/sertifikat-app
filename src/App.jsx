import { useState } from 'react';
import { generateCertificate, downloadPdf } from './generateCertificate';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | error
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setStatus('loading');
    setError('');
    try {
      const bytes = await generateCertificate(trimmed);
      downloadPdf(bytes, `Sertifikat - ${trimmed}.pdf`);
      setStatus('idle');
    } catch (err) {
      console.error(err);
      setError('Gagal membuat sertifikat. Silakan coba lagi.');
      setStatus('error');
    }
  };

  return (
    <main className="page">
      <div className="card">
        <p className="eyebrow">Generator Sertifikat Digital</p>
        <h1>Ijazah Latihan Dalam Dinas Komputer</h1>
        <p className="subtitle">
          Masukkan nama lengkap peserta untuk membuat dan mengunduh sertifikat secara otomatis.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Nama Lengkap</label>
          <input
            id="name"
            type="text"
            placeholder="Contoh: Budi Santoso"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            required
          />

          <button type="submit" disabled={status === 'loading' || !name.trim()}>
            {status === 'loading' ? 'Membuat sertifikat…' : 'Buat & Unduh Sertifikat'}
          </button>

          {status === 'error' && <p className="error">{error}</p>}
        </form>
      </div>
    </main>
  );
}

export default App;
