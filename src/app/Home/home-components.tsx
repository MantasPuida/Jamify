import Button from "@mui/material/Button";
import * as React from "react";
import { NavigateFunction, useNavigate } from "react-router";
import { useSpotifyAuth } from "../../context/spotify-context";
import { AppRoutes } from "../routes/routes";

interface InnerProps {
  logout: () => void;
  navigate: NavigateFunction;
}

class HomeClass extends React.PureComponent<InnerProps> {
  private handleOnClick = () => {
    const { logout, navigate } = this.props;

    logout();
    navigate(AppRoutes.Dashboard);
  };

  public render(): React.ReactNode {
    return <Button onClick={this.handleOnClick}>Logout</Button>;
  }
}

export const Home = React.memo(() => {
  const { logout } = useSpotifyAuth();
  const navigate = useNavigate();

  return <HomeClass logout={logout} navigate={navigate} />;
});
