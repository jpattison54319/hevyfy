import React from "react";
import Emoji from "../Emoji/Emoji";

interface WorkoutLoggedToastProps {
  open: boolean;
  onClose: () => void;
}

export const WorkoutLoggedToast: React.FC<WorkoutLoggedToastProps> = ({ open, onClose }) => {
  if (!open) return null;  
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 16,
        backgroundColor: "#1c1c1c",
        border: "3px solid #ffa640",
        color: "#FFFDD0",
        fontFamily: "'Press Start 2P', monospace, sans-serif",
        fontSize: 12,
        textTransform: "uppercase",
        boxShadow: "0 0 8px #ffa640",
        borderRadius: 8,
        
        top: 0,
        left: 0,
        right: 0
      }}
    >
        <Emoji size={32} symbol="🏋️‍♂️"/>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 4 }}>WORKOUT LOGGED!</div>
        <div style={{ fontSize: 10, color: "#ccc" }}>
          +XP gained ⚡ | Pet stronger 🐾
        </div>
      </div>
      <button
        aria-label="Close notification"
        onClick={onClose}
        style={{
          background: "transparent",
          color: "#FFFDD0",
          fontFamily: "'Press Start 2P', monospace, sans-serif",
          border: "none",
          cursor: "pointer",
          fontSize: 14,
          padding: 0,
          lineHeight: 1,
        }}
      >
        ✖
      </button>
    </div>
  );
};