import * as React from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { useDeezerAuth } from "../../context/deezer-context";
import { useSpotifyAuth } from "../../context/spotify-context";
import { useUserContext } from "../../context/user-context";
import { useYoutubeAuth } from "../../context/youtube-context";
import { MePlaylist } from "./me-component";

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

interface InnerProps {
  spotifyToken: string | null;
  deezerToken: string | null;
  youtubeToken: string | null;
  userId?: string;
}

type Props = OuterProps & InnerProps;

class MeComponentClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { spotifyApi, userId, spotifyToken, youtubeToken } = this.props;

    return (
      <>
        {spotifyToken && <MePlaylist spotifyApi={spotifyApi} playlistSource="Spotify" />}
        {youtubeToken && <MePlaylist spotifyApi={spotifyApi} playlistSource="Youtube" />}
        {userId && <MePlaylist spotifyApi={spotifyApi} playlistSource="Own" />}
      </>
    );
  }
}

export const MeComponent = React.memo<OuterProps>((props) => {
  const { spotifyToken } = useSpotifyAuth();
  const { deezerToken } = useDeezerAuth();
  const { youtubeToken } = useYoutubeAuth();
  const { userId } = useUserContext();

  return (
    <MeComponentClass
      userId={userId}
      spotifyToken={spotifyToken}
      deezerToken={deezerToken}
      youtubeToken={youtubeToken}
      {...props}
    />
  );
});
