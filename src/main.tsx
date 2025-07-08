import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { UserProvider } from "./context/UserContext";
import { ToastProvider } from "./context/ToastContext";
import { SplashScreenProvider } from "./context/SplashScreen";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <UserProvider>
      <ToastProvider>
            <SplashScreenProvider>
      <App />
      </SplashScreenProvider>
      </ToastProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);


