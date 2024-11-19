import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./routes";
import { Buffer } from "buffer";

// Assign Buffer globally so it's available everywhere
window.Buffer = Buffer;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
