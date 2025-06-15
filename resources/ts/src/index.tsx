import { createRoot } from "react-dom/client";
import React from "react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("app") as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
