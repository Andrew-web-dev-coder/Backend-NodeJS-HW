import React, { useEffect } from "react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 20,
      right: 20,
      background: "#333",
      color: "white",
      padding: "12px 18px",
      borderRadius: 8,
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      zIndex: 9999,
      fontSize: 16,
    }}>
      {message}
    </div>
  );
}
