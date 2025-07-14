// components/PwaInstallPrompt.tsx
import { useEffect, useState } from "react";
import styles from "./PwaInstallPrompt.module.scss";

const isIos = () =>
  /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

const isInStandaloneMode = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

export default function PwaInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const hasSeenPrompt = localStorage.getItem("pwaPromptSeen");

    if (isIos() && !isInStandaloneMode() && !hasSeenPrompt) {
      setShowPrompt(true);
    }
  }, []);

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem("pwaPromptSeen", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className={styles.prompt}>
      <div className={styles.text}>
        <strong>XPets is best when used as an app!</strong><br />
        <strong>Install XPets: HealthQuest</strong><br />
        On Safari, tap the “Share” button (square with arrow ↑) then “Add to Home Screen” to install the app.
      </div>
      <button className={styles.dismiss} onClick={dismissPrompt}>
        ✕
      </button>
    </div>
  );
}
