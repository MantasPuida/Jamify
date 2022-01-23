import Button from "@mui/material/Button";
import * as React from "react";
import { NavigateFunction, useNavigate } from "react-router";
import { useAuth } from "../../context/spotify-context";

interface InnerProps {
  logout: () => void;
  navigate: NavigateFunction;
}

class HomeClass extends React.PureComponent<InnerProps> {
  private handleOnClick = () => {
    const { logout, navigate } = this.props;

    logout();
    navigate("/dashboard");
    // also logout from spotify
  };

  public render(): React.ReactNode {
    return <Button onClick={this.handleOnClick}>Logout</Button>;
  }
}

export const Home = React.memo(() => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return <HomeClass logout={logout} navigate={navigate} />;
});
