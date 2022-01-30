import * as React from "react";
import { NavigateFunction, useNavigate } from "react-router";
import { Button, ButtonProps } from "@mui/material";
import { Notify } from "../notification/notification-component";
import { useYoutubeAuth } from "../../context/youtube-context";
import { AppRoutes } from "../routes/routes";
import { SpotifyConstants } from "../../constants/constants-spotify";
import { LastTick } from "../../utils/last-tick";

interface OuterProps {
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
}

interface InnerProps {
  googleAuthObject: gapi.auth2.GoogleAuthBase | undefined;
  register: Function;
  navigate: NavigateFunction;
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

  private onClick: ButtonProps["onClick"] = () => {
    const { googleAuthObject, register, navigate } = this.props;

    googleAuthObject
      ?.signIn()
      .then((value: gapi.auth2.GoogleUser) => {
        register(value.getAuthResponse().access_token);
        navigate(AppRoutes.Home);
      })
      .catch(() => {
        this.handleNotify();
      });
  };

  private handleOnClick: ButtonProps["onClick"] = () => {
    window.open(SpotifyConstants.SPOTIFY_AUTH_URL, "Login with Spotify");
  };

  public render(): React.ReactNode {
    const { error } = this.props;

    if (error) {
      this.handleNotify();
    }

    return (
      <>
        <Button onClick={this.handleOnClick}>Login With Spotify</Button>
        <Button onClick={this.onClick}>Login With Youtube</Button>
      </>
    );
  }
}

export const Dashboard = React.memo<OuterProps>((props) => {
  const { googleAuthObject, register } = useYoutubeAuth();
  const navigate = useNavigate();

  return <DashboardClass googleAuthObject={googleAuthObject} register={register} navigate={navigate} {...props} />;
});
