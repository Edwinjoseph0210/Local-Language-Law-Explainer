import React, { useState } from 'react';
import './App.css';

const LANGUAGES = [
  { code: 'hi', label: 'Hindi' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'ta', label: 'Tamil' },
];

function App() {
  const [rawText, setRawText] = useState('');
  const [summary, setSummary] = useState('');
  const [targetLang, setTargetLang] = useState('hi');
  const [translated, setTranslated] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    const res = await fetch('http://localhost:8000/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setRawText(data.text);
    setLoading(false);
  };

  const handleSummarize = async () => {
    setLoading(true);
    setSummary('');
    setTranslated('');
    setAudioUrl('');
    const res = await fetch('http://localhost:8000/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: rawText }),
    });
    const data = await res.json();
    setSummary(data.summary);
    setLoading(false);
  };

  const handleTranslate = async () => {
    setLoading(true);
    setTranslated('');
    setAudioUrl('');
    const res = await fetch('http://localhost:8000/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: summary, target_language: targetLang }),
    });
    const data = await res.json();
    setTranslated(data.translated_text);
    setLoading(false);
  };

  const handleTTS = async () => {
    setLoading(true);
    setAudioUrl('');
    const res = await fetch('http://localhost:8000/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: translated, language: targetLang }),
    });
    const blob = await res.blob();
    setAudioUrl(URL.createObjectURL(blob));
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Local Language Law Explainer</h2>
        <textarea
          rows={8}
          cols={60}
          placeholder="Paste legal text here..."
          value={rawText}
          onChange={e => setRawText(e.target.value)}
          style={{ fontFamily: 'inherit', fontSize: 16 }}
        />
        <div style={{ margin: '10px' }}>
          <input type="file" accept=".txt" onChange={handleFileUpload} />
        </div>
        <button onClick={handleSummarize} disabled={!rawText || loading}>
          Summarize
        </button>
        {summary && (
          <div style={{ marginTop: 20, width: '80%' }}>
            <h3>Summary (Plain English):</h3>
            <div style={{ background: '#fff', color: '#222', padding: 10, borderRadius: 6 }}>{summary}</div>
            <div style={{ marginTop: 20 }}>
              <label>Translate to: </label>
              <select value={targetLang} onChange={e => setTargetLang(e.target.value)}>
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
              <button onClick={handleTranslate} disabled={loading} style={{ marginLeft: 10 }}>
                Translate
              </button>
            </div>
          </div>
        )}
        {translated && (
          <div style={{ marginTop: 20, width: '80%' }}>
            <h3>Translation:</h3>
            <div style={{ background: '#fff', color: '#222', padding: 10, borderRadius: 6, fontFamily: 'Noto Sans, Arial, sans-serif', fontSize: 18 }}>{translated}</div>
            <button onClick={handleTTS} disabled={loading} style={{ marginTop: 10 }}>
              Play Audio
            </button>
            {audioUrl && (
              <div style={{ marginTop: 10 }}>
                <audio controls src={audioUrl} />
              </div>
            )}
          </div>
        )}
        {loading && <div style={{ marginTop: 20 }}>Processing...</div>}
      </header>
    </div>
  );
}

export default App;
