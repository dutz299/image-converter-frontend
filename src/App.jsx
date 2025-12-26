import { useState } from "react";

const API_BASE = "https://image-converter-backend-kvz6.onrender.com";
const AD_SCRIPT =
  "https://pl28339042.effectivegatecpm.com/89/f4/4d/89f44d1ee7fda7ebb0ab5a814df9d988.js";

/* =====================
   IMPRESSUM
===================== */
function Impressum() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Impressum</h1>
      <pre>
{`Angaben gemäß § 5 TMG

Name:
Dorian Sandow

Anschrift:
Stemberg 70
32805 Horn-Bad Meinberg
Deutschland

Kontakt:
E-Mail: dutz299@gmail.com

Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
Dorian Sandow
Stemberg 70
32805 Horn-Bad Meinberg
Deutschland`}
      </pre>
      <br />
      <a href="/">← Zurück</a>
    </div>
  );
}

/* =====================
   DATENSCHUTZ
===================== */
function Datenschutz() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Datenschutzerklärung</h1>
      <pre>
{`Verantwortlicher:
Dorian Sandow
Stemberg 70
32805 Horn-Bad Meinberg
Deutschland
E-Mail: dutz299@gmail.com

Beim Besuch der Website werden technisch notwendige Daten verarbeitet
(z. B. IP-Adresse, Browsertyp, Uhrzeit).

Datei-Uploads:
Bilder werden nur zur Konvertierung genutzt und spätestens
nach 30 Minuten automatisch gelöscht.

Werbung:
Diese Website nutzt Werbung von Adsterra.
https://adsterra.com/privacy-policy

Hosting:
Frontend: Vercel Inc.
Backend: Render Services, Inc.

Rechte:
Sie haben das Recht auf Auskunft, Löschung und Widerspruch
gemäß DSGVO.`}
      </pre>
      <br />
      <a href="/">← Zurück</a>
    </div>
  );
}

/* =====================
   APP
===================== */
function App() {
  const path = window.location.pathname;

  if (path === "/impressum") return <Impressum />;
  if (path === "/datenschutz") return <Datenschutz />;

  const [files, setFiles] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [adUnlocked, setAdUnlocked] = useState(false);
  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const [countdown, setCountdown] = useState(14);

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

  const watchAd = () => {
    if (!sessionId || adUnlocked) return;

    setShowAdOverlay(true);
    setCountdown(14);

    const script = document.createElement("script");
    script.src = AD_SCRIPT;
    script.async = true;
    document.body.appendChild(script);

    const interval = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    setTimeout(async () => {
      clearInterval(interval);

      await fetch(`${API_BASE}/ad-complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });

      setAdUnlocked(true);
      setShowAdOverlay(false);
    }, 14000);
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

      <button onClick={watchAd} disabled={!sessionId || adUnlocked}>
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

      {showAdOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2>Bitte kurze Werbung ansehen</h2>
            <div style={{ fontSize: 36 }}>
              {countdown > 0 ? countdown : "✔"}
            </div>
          </div>
        </div>
      )}

      <hr style={{ marginTop: 40 }} />
      <div style={{ fontSize: 14 }}>
        <a href="/impressum">Impressum</a> |{" "}
        <a href="/datenschutz">Datenschutz</a>
      </div>
    </div>
  );
}

export default App;
