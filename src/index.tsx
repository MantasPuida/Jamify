import * as React from "react";
import ReactDOM from "react-dom";
import { AppStartup } from "./shared/app-startup";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/spotify-context";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <AuthProvider>
    <AppStartup />
  </AuthProvider>,
  rootElement
);

reportWebVitals();
