import * as React from "react";
import Button from "@mui/material/Button";
import { NavigateFunction, useNavigate } from "react-router";
import SpotifyWebApi from "spotify-web-api-node";
import { useSpotifyAuth } from "../../context/spotify-context";
import { AppRoutes } from "../routes/routes";
import { useYoutubeAuth } from "../../context/youtube-context";

type LogoutFunctionType = () => void;

interface InnerProps {
  logoutYoutube: LogoutFunctionType;
  logoutSpotify: LogoutFunctionType;
  navigate: NavigateFunction;
}

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

type Props = InnerProps & OuterProps;

class HomeClass extends React.PureComponent<Props> {
  private handleOnClick = () => {
    const { logoutYoutube, logoutSpotify, navigate } = this.props;

    // TODO: implement different logouts in order to keep playing music from single/multiple sources
    logoutSpotify();
    logoutYoutube();
    navigate(AppRoutes.Dashboard);
  };

  public render(): React.ReactNode {
    return <Button onClick={this.handleOnClick}>Logout</Button>;
  }
}

export const Home = React.memo<OuterProps>((props) => {
  const { logout: logoutSpotify } = useSpotifyAuth();
  const { logout: logoutYoutube } = useYoutubeAuth();
  const navigate = useNavigate();

  return <HomeClass logoutSpotify={logoutSpotify} logoutYoutube={logoutYoutube} navigate={navigate} {...props} />;
});
