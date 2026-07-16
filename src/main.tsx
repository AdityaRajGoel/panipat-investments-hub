import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import "./index.css";

// Register Service Worker for PWA
registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(<App />);

// Fade out the static splash once React has painted, so users never see the
// prerendered-HTML -> client-render flash. Safety timeout in case a paint stalls.
const hideSplash = () => {
  const el = document.getElementById("app-splash");
  if (!el) return;
  el.classList.add("hide");
  window.setTimeout(() => el.remove(), 500);
};
// Skip under Puppeteer (navigator.webdriver) so the splash stays baked into the
// prerendered HTML; real browsers fade it once React has painted.
if (!navigator.webdriver) {
  requestAnimationFrame(() => requestAnimationFrame(hideSplash));
  window.setTimeout(hideSplash, 4000);
}
