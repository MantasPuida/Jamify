import * as React from "react";
import ReactDOM from "react-dom";
import { AppStartup } from "./shared/app-startup";
import reportWebVitals from "./reportWebVitals";
import { SpotifyAuthProvider } from "./context/spotify-context";
import { YoutubeAuthProvider } from "./context/youtube-context";
import { DeezerAuthProvider } from "./context/deezer-context";
import { PlayerProvider } from "./context/player-context";
import { UserProvider } from "./context/user-context";
import { AppProvider } from "./context/app-context";
import { YoutubeApiProvider } from "./context/youtube-api-context";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <YoutubeApiProvider>
    <AppProvider>
      <UserProvider>
        <PlayerProvider>
          <SpotifyAuthProvider>
            <YoutubeAuthProvider>
              <DeezerAuthProvider>
                <AppStartup />
              </DeezerAuthProvider>
            </YoutubeAuthProvider>
          </SpotifyAuthProvider>
        </PlayerProvider>
      </UserProvider>
    </AppProvider>
  </YoutubeApiProvider>,
  rootElement
);

reportWebVitals();
