import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { PatientContextProvider } from "./context/PatientContext.jsx";
import { SessionContextProvider } from "./context/SessionContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <PatientContextProvider>
        <SessionContextProvider>
          <App />
        </SessionContextProvider>
      </PatientContextProvider>
    </AuthContextProvider>
  </StrictMode>,
);
