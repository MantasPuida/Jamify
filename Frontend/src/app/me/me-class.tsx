import * as React from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { useAppContext } from "../../context/app-context";
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
  setLoading: Function;
  loading: boolean;
}

type Props = OuterProps & InnerProps;

class MeComponentClass extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    const { setLoading } = props;
    setLoading(true);
  }

  public render(): React.ReactNode {
    const { spotifyApi, userId, spotifyToken, youtubeToken, deezerToken } = this.props;

    return (
      <>
        {spotifyToken && (
          <MePlaylist
            spotifyApi={spotifyApi}
            playlistSource="Spotify"
            shouldCancelLoader={!youtubeToken && !deezerToken && !userId}
          />
        )}
        {youtubeToken && (
          <MePlaylist spotifyApi={spotifyApi} playlistSource="Youtube" shouldCancelLoader={!deezerToken && !userId} />
        )}
        {deezerToken && <MePlaylist spotifyApi={spotifyApi} playlistSource="Deezer" shouldCancelLoader={!userId} />}
        {userId && <MePlaylist spotifyApi={spotifyApi} playlistSource="Own" shouldCancelLoader={true} />}
      </>
    );
  }
}

export const MeComponent = React.memo<OuterProps>((props) => {
  const { spotifyToken } = useSpotifyAuth();
  const { deezerToken } = useDeezerAuth();
  const { youtubeToken } = useYoutubeAuth();
  const { userId } = useUserContext();
  const { setLoading, loading } = useAppContext();

  return (
    <MeComponentClass
      setLoading={setLoading}
      loading={loading}
      userId={userId}
      spotifyToken={spotifyToken}
      deezerToken={deezerToken}
      youtubeToken={youtubeToken}
      {...props}
    />
  );
});
