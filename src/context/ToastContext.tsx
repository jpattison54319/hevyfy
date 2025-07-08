import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";

interface Toast {
  id: number;
  content: ReactNode;  // so you can pass strings or custom components
  severity?: "success" | "error" | "info" | "warning";
  duration?: number; // in milliseconds (optional)

}

interface ToastContextValue {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue  | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

let toastIdCounter = 0;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


// Change file extension to .tsx if not already, since JSX is used below
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<Toast[]>([]);     // All toasts waiting
  const [currentToast, setCurrentToast] = useState<Toast | null>(null); // Currently shown toast

    useEffect(() => {
    if (!currentToast && queue.length > 0) {
      setCurrentToast(queue[0]);
      setQueue((prev) => prev.slice(1));
    }
  }, [queue, currentToast]);

 useEffect(() => {
  if (!currentToast) return;

  const duration = currentToast.duration ?? 3000; // ✅ default to 3 seconds
  const timer = setTimeout(() => {
    setCurrentToast(null);
  }, duration);

  return () => clearTimeout(timer);
}, [currentToast]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = ++toastIdCounter;
    setQueue((prev) => [...prev, { id, ...toast }]);
  }, []);

  const removeToast = useCallback(() => {
    setCurrentToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {currentToast && (<div
       role="alert"
      aria-live="assertive"
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
         <div key={currentToast.id}>{currentToast.content}</div>
      </div>
      )}
    </ToastContext.Provider>
  );
};