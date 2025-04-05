import { createRoot } from "react-dom/client";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

createRoot(document.getElementById("app") as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <Dashboard />
        </BrowserRouter>
    </React.StrictMode>
);
