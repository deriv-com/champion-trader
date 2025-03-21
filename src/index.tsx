import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import "./global.css";
import * as serviceWorkerRegistration from "./pwa/serviceWorkerRegistration";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    container
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
