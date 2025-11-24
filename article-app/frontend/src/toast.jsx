import React, { createContext, useState } from "react";
import Toast from "../shared/ui/toast/Toast.jsx";
import { registerToast } from "./toastClient";

export const ToastContext = createContext({
  show: () => {},
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function show(message) {
    const id = Date.now();

    
    setToasts((list) => [...list, { id, message }]);

    
    setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, 2500);
  }

  
  registerToast(show);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          onClose={() =>
            setToasts((list) => list.filter((x) => x.id !== t.id))
          }
        />
      ))}
    </ToastContext.Provider>
  );
}
