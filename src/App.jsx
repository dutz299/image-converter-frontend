import { useState } from "react";

const API_BASE = "https://image-converter-backend-kvz6.onrender.com";
const AD_SCRIPT =
  "https://pl28339042.effectivegatecpm.com/89/f4/4d/89f44d1ee7fda7ebb0ab5a814df9d988.js";

function App() {
  const [files, setFiles] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [adUnlocked, setAdUnlocked] = useState(false);
  const [showAdOverlay, setShowAdOverlay] = useState(false);

  // =====================
  // UPLOAD
  // =====================
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

  // =====================
  // WERBUNG + FREIGABE
  // =====================
  const watchAd = () => {
    if (!sessionId) return;

    setShowAdOverlay(true);

    // Adsterra Script laden
    const script = document.createElement("script");
    script.src = AD_SCRIPT;
    script.async = true;
    document.body.appendChild(script);

    // Sicherheits-Timer (10 Sek.)
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
    <div style={{ padding:
