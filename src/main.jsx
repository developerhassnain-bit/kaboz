import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.jsx";
import LanguageProvider from "./context/LanguageContext.jsx";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LanguageProvider>
      <ShopContextProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </ShopContextProvider>
    </LanguageProvider>
  </BrowserRouter>,
);
