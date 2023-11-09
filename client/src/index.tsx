import React from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/scss/bootstrap.scss";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <div></div>
    </React.StrictMode>,
  );
}
