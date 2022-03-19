import * as React from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { HomeLandingPage } from "./home-landing-page";

interface Props {
  spotifyApi: SpotifyWebApi;
}

class HomeClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { spotifyApi } = this.props;

    return <HomeLandingPage spotifyApi={spotifyApi} />;
  }
}

export const Home = React.memo<Props>((props) => <HomeClass {...props} />);
