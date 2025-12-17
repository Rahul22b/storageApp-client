import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// 💡 Redux Imports
import { Provider } from "react-redux";
import { store } from "./store/store"; // <-- Import your configured Redux store

// Google Auth Imports (Unchanged)
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 🚀 FIX: Wrap the application in the Redux Provider */}
    <Provider store={store}>
      {/* GoogleOAuthProvider and App remain nested */}
      <GoogleOAuthProvider clientId={clientId}>
        <App />
         <Toaster position="top-right" />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>
);