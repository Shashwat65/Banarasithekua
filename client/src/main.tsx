import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Handle SPA redirect from 404.html fallback
// This ensures direct URL access (e.g., /terms) loads the correct page
const redirect = sessionStorage.getItem('spa_redirect');
if (redirect) {
  sessionStorage.removeItem('spa_redirect');
  window.history.replaceState(null, '', redirect);
}

createRoot(document.getElementById("root")!).render(<App />);
