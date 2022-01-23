import * as React from "react";
import { SPOTIFY_AUTH_URL } from "../../constants/constants";
import { Notify } from "../notification/notification-component";

interface OuterProps {
  error: boolean;
}

export class Dashboard extends React.PureComponent<OuterProps> {
  public render(): React.ReactNode {
    const { error } = this.props;

    if (error) {
      Notify("Error accrued when logging in", "error");
    }

    return <a href={SPOTIFY_AUTH_URL}>Login with Spotify</a>;
  }
}
