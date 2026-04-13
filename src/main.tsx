import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import AuthTokenSync from "./components/AuthTokenSync";
import { store } from "./store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthTokenSync />
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
