import React, { useState, useEffect } from "react";
import { registerToast } from "./toastClient";

export function ToastProvider({ children }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    registerToast((msg) => {
      setMessage(msg);
      setTimeout(() => setMessage(""), 3000);
    });
  }, []);

  return (
    <>
      {children}

      {message && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            padding: "14px 20px",
            background: "#222",
            color: "white",
            borderRadius: 8,
            fontSize: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 9999,
          }}
        >
          {message}
        </div>
      )}
    </>
  );
}
