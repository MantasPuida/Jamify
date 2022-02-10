import * as React from "react";
import { ToastContainer } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { AppTheme, AppThemeInstance } from "./app-theme";
import Jamify from "../app/Jamify";
import { YoutubeConstants } from "../constants/constants-youtube";
import { useYoutubeAuth } from "../context/youtube-context";
import { DeezerConstants } from "../constants/constants-deezer";

type LoadCallback = (...args: any[]) => void;

interface InnerProps {
  setGoogleAuthObject: Function;
}

class AppStartupClass extends React.PureComponent<InnerProps> {
  constructor(props: InnerProps) {
    super(props);

    injectStyle();
    gapi.load("client:auth2", this.initGapiClient);
    this.initDeezerClient();
  }

  private initDeezerClient = () => {
    DZ.init({
      appId: process.env.REACT_APP_DEEZER_APP_ID!,
      channelUrl: DeezerConstants.DEEZER_REDIRECT_URI
    });
  };

  private initGapiClient: LoadCallback = () => {
    const { setGoogleAuthObject } = this.props;

    gapi.client
      .init({
        apiKey: process.env.REACT_APP_YOUTUBE_API_KEY,
        clientId: process.env.REACT_APP_YOUTUBE_CLIENT_ID,
        discoveryDocs: [YoutubeConstants.discoveryUrl],
        scope: YoutubeConstants.YOUTUBE_SCOPES.join(" ")
      })
      .then(() => {
        const GoogleAuth: gapi.auth2.GoogleAuth = gapi.auth2.getAuthInstance();
        setGoogleAuthObject(GoogleAuth);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  };

  public render(): React.ReactNode {
    return (
      <ThemeProvider<AppTheme> theme={AppThemeInstance}>
        <StyledEngineProvider injectFirst={true}>
          <BrowserRouter>
            <Jamify />
            <ToastContainer limit={3} />
          </BrowserRouter>
        </StyledEngineProvider>
      </ThemeProvider>
    );
  }
}

export const AppStartup = React.memo(() => {
  const { setGoogleAuthObject } = useYoutubeAuth();

  return <AppStartupClass setGoogleAuthObject={setGoogleAuthObject} />;
});
