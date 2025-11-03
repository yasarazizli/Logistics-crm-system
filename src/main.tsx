import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "../src/assets/styles/global.scss";
import "./locales/i18n.ts";
import { Buffer } from "buffer";

declare global {
  interface Window {
    Buffer: typeof Buffer;
    global: Window & typeof globalThis;
  }
}

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
  window.global = window;
}

createRoot(document.getElementById("root")!).render(<App />);
