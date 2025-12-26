import { useState } from "react";

const API_BASE = "https://image-converter-backend-kvz6.onrender.com";
const AD_SCRIPT =
  "https://pl28339042.effectivegatecpm.com/89/f4/4d/89f44d1ee7fda7ebb0ab5a814df9d988.js";

function App() {
  const [files, setFiles] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [adUnlocked, setAdUnlocked] = useState(false);
  const [showAdOverlay, setShowAdOverlay] = useState(false);

  // Upload
  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setSessionId(data.sessionId);
  };

  // Werbung anzeigen + freischalten
  const watchAd = () => {
    if (!sessionId) return;

    setShowAdOverlay(true);

    const script = document.createElement("script");
    script.src = AD_SCRIPT;
    script.async = true;
    document.body.appendChild(script);

    // Fallback-Timer (10 Sekunden)
    setTimeout(async () => {
      await fetch(`${API_BASE}/ad-complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });

      setAdUnlocked(true);
      setShowAdOverlay(false);
    }, 10000);
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

      <br />
      <br />

      <button onClick={handleUpload} disabled={files.length === 0}>
        Dateien hochladen
      </button>

      <br />
      <br />

      <button onClick={watchAd} disabled={!sessionId}>
        Werbung ansehen & freischalten
      </button>

      <br />
      <br />

      <button
        disabled={!adUnlocked}
        onClick={() =>
          (window.location.href = `${API_BASE}/convert/${sessionId}`)
        }
      >
        Konvertierung starten
      </button>

      {showAdOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            fontSize: 24
          }}
        >
          Werbung wird geladen …
        </div>
      )}
    </div>
  );
}

export default App;
