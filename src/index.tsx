import * as React from "react";
import ReactDOM from "react-dom";
import { AppStartup } from "./shared/app-startup";
import reportWebVitals from "./reportWebVitals";
import { SpotifyAuthProvider } from "./context/spotify-context";
import { YoutubeAuthProvider } from "./context/youtube-context";
import { DeezerAuthProvider } from "./context/deezer-context";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <SpotifyAuthProvider>
    <YoutubeAuthProvider>
      <DeezerAuthProvider>
        <AppStartup />
      </DeezerAuthProvider>
    </YoutubeAuthProvider>
  </SpotifyAuthProvider>,
  rootElement
);

reportWebVitals();
