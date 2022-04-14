import * as React from "react";
import { NavigateFunction, useLocation, Location, useNavigate } from "react-router";
import { ButtonProps } from "@mui/material";
import { Notify } from "../notification/notification-component";
import { useYoutubeAuth } from "../../context/youtube-context";
import { AppRoutes } from "../routes/routes";
import { SpotifyConstants } from "../../constants/constants-spotify";
import { LastTick } from "../../utils/last-tick";
import { useDeezerAuth } from "../../context/deezer-context";
import { DeezerConstants } from "../../constants/constants-deezer";
import { DashboardLandingPage } from "./dashboard-landing-page";
import { useAppContext } from "../../context/app-context";

interface OuterProps {
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
}

interface InnerProps {
  googleAuthObject: gapi.auth2.GoogleAuthBase | undefined;
  registerYoutubeToken: Function;
  registerDeezerToken: Function;
  navigate: NavigateFunction;
  location: Location;
  setDeezerUserId: Function;
  setIsOnline: Function;
}

type Props = InnerProps & OuterProps;

class DashboardClass extends React.PureComponent<Props> {
  private handleNotify = (): void => {
    const { setError } = this.props;
    Notify("Unable to authenticate", "error");
    LastTick(() => {
      setError(false);
    });
  };

  private handleLoginYoutube: ButtonProps["onClick"] = () => {
    const { googleAuthObject, registerYoutubeToken, navigate, setIsOnline } = this.props;

    googleAuthObject
      ?.signIn()
      .then((value: gapi.auth2.GoogleUser) => {
        const { access_token: AccessToken } = value.getAuthResponse();

        registerYoutubeToken(AccessToken);
        gapi.client.setToken({ access_token: AccessToken });
        setIsOnline(true);
        navigate(AppRoutes.Home);
      })
      .catch(() => {
        this.handleNotify();
      });
  };

  private handleLoginSpotify: ButtonProps["onClick"] = () => {
    // TODO: implement popup
    window.open(SpotifyConstants.SPOTIFY_AUTH_URL, "_self");
  };

  private handleLoginDeezer: ButtonProps["onClick"] = () => {
    const { registerDeezerToken, navigate, setDeezerUserId, setIsOnline } = this.props;

    DZ.login(
      (response) => {
        const { status, authResponse, userID } = response;
        if (status === "connected" && authResponse.accessToken) {
          const { accessToken } = authResponse;

          registerDeezerToken(accessToken);
          setDeezerUserId(userID);
          setIsOnline(true);
          navigate(AppRoutes.Home);
        } else {
          this.handleNotify();
        }
      },
      { perms: DeezerConstants.scopes.join(",") }
    );
  };

  public render(): React.ReactNode {
    const { error } = this.props;

    if (error) {
      this.handleNotify();
    }

    return (
      <div style={{ overflow: "hidden" }}>
        <DashboardLandingPage
          spotifyLogin={this.handleLoginSpotify}
          youtubeLogin={this.handleLoginYoutube}
          deezerLogin={this.handleLoginDeezer}
        />
      </div>
    );
  }
}

export const Dashboard = React.memo<OuterProps>((props) => {
  const { googleAuthObject, register: RegisterYoutubeToken } = useYoutubeAuth();
  const { register: RegisterDeezerToken, setDeezerUserId } = useDeezerAuth();
  const { setIsOnline } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <DashboardClass
      googleAuthObject={googleAuthObject}
      setDeezerUserId={setDeezerUserId}
      registerDeezerToken={RegisterDeezerToken}
      registerYoutubeToken={RegisterYoutubeToken}
      setIsOnline={setIsOnline}
      navigate={navigate}
      location={location}
      {...props}
    />
  );
});
