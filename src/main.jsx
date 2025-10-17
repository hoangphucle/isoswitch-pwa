import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./styles.css"

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then(reg => console.log("SW registered", reg))
      .catch(err => console.log("SW register failed", err))
  })
}

createRoot(document.getElementById("root")).render(<App />)
