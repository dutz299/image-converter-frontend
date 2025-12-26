import { useState } from "react";

const API_BASE = "https://image-converter-backend-kvz6.onrender.com";

function App() {
  const [files, setFiles] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [adUnlocked, setAdUnlocked] = useState(false);

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach(file => formData.append("images", file));

    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setSessionId(data.sessionId);
  };

  const watchAd = async () => {
    // Simulierter Reward (3 Sekunden)
    setTimeout(async () => {
      await fetch(`${API_BASE}/ad-complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });
      setAdUnlocked(true);
    }, 3000);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Image Converter</h1>

      <input
        type="file"
        multiple
        accept="image/jpeg"
        onChange={(e) => setFiles([...e.target.files])}
      />

      <br /><br />

      <button onClick={handleUpload} disabled={files.length === 0}>
        Dateien hochladen
      </button>

      <br /><br />

      <button onClick={watchAd} disabled={!sessionId}>
        Werbung ansehen & freischalten
      </button>

      <br /><br />

      <button
        disabled={!adUnlocked}
        onClick={() =>
          (window.location.href = `${API_BASE}/convert/${sessionId}`)
        }
      >
        Konvertierung starten
      </button>
    </div>
  );
}

export default App;
