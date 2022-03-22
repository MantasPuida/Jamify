import * as React from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { MePlaylist } from "./me-component";

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

type Props = OuterProps;

class MeComponentClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { spotifyApi } = this.props;

    return (
      <>
        <MePlaylist spotifyApi={spotifyApi} playlistSource="Spotify" />
        <MePlaylist spotifyApi={spotifyApi} playlistSource="Youtube" />
        <MePlaylist spotifyApi={spotifyApi} playlistSource="Own" />
      </>
    );
  }
}

export const MeComponent = React.memo<OuterProps>((props) => <MeComponentClass {...props} />);
