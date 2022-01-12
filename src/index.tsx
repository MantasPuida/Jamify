import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { AppStartup } from "./shared/app-startup";
import reportWebVitals from "./reportWebVitals";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <AppStartup />
  </Provider>,
  rootElement
);

reportWebVitals();
