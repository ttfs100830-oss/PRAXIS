import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { LearnerProvider } from "./context/LearnerContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <LearnerProvider>
        <App />
      </LearnerProvider>
    </AuthProvider>
  </React.StrictMode>,
);
