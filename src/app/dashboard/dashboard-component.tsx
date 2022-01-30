import * as React from "react";
import { NavigateFunction, useNavigate } from "react-router";
import { Button, ButtonProps } from "@mui/material";
import { Notify } from "../notification/notification-component";
import { useYoutubeAuth } from "../../context/youtube-context";
import { SPOTIFY_AUTH_URL } from "../../constants/constants-spotify";
import { AppRoutes } from "../routes/routes";

interface OuterProps {
  error: boolean;
}

interface InnerProps {
  googleAuthObject: gapi.auth2.GoogleAuthBase | undefined;
  register: Function;
  navigate: NavigateFunction;
}

type Props = InnerProps & OuterProps;

class DashboardClass extends React.PureComponent<Props> {
  private onClick: ButtonProps["onClick"] = () => {
    const { googleAuthObject, register, navigate } = this.props;

    googleAuthObject
      ?.signIn()
      .then((value: gapi.auth2.GoogleUser) => {
        register(value.getAuthResponse().access_token);
        navigate(AppRoutes.Home);
      })
      .catch((err) => {
        Notify(err, "error");
      });
  };

  private handleOnClick: ButtonProps["onClick"] = () => {
    window.open(SPOTIFY_AUTH_URL, "Login with Spotify", "width=800,height=600");
  };

  public render(): React.ReactNode {
    const { error } = this.props;

    if (error) {
      Notify("Error accrued when logging in", "error");
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
