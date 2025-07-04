import React, { useEffect, useState } from "react";

interface FishProps {
  consumed?: boolean;
  size?: number; // width in px (height will be proportional)
  className?: string;
}

export const Fish: React.FC<FishProps> = ({ consumed = false, size = 48, className }) => {
  const [shrink, setShrink] = useState(false);

  useEffect(() => {
    if (consumed) {
      // Trigger the shrink animation on next tick
      const timer = setTimeout(() => setShrink(true), 20);
      return () => clearTimeout(timer);
    } else {
      setShrink(false);
    }
  }, [consumed]);

  return (
    <img
   src="/fish.png"
  alt="Fish"
  style={{
    width: "100%",
    height: "auto",
    maxWidth: "100x", // optional cap
    transformOrigin: "center",
    transition: "transform 1s ease, opacity 1.5s ease",
    transform: shrink ? "scale(0) rotate(450deg)"  : "scale(1) rotate(90deg)",
    display: "block",
    opacity: shrink ? 0 : 1,
  }}
    >
    </img>
  );
};