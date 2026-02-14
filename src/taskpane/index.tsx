import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

/* global document, Office, HTMLElement */

const rootElement: HTMLElement | null = document.getElementById("container");
const root = rootElement ? createRoot(rootElement) : undefined;

let rendered = false;
function renderApp(): void {
  if (rendered || !root) return;
  rendered = true;
  root.render(<App />);
}

/* Render when running inside Office */
if (typeof Office !== "undefined" && Office.onReady) {
  Office.onReady(() => renderApp());
  /* Fallback: render after 2s if Office never becomes ready (e.g. opened in plain browser) */
  setTimeout(renderApp, 2000);
} else {
  renderApp();
}
