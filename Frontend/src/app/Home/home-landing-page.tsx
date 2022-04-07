import * as React from "react";
import { Grid } from "@mui/material";
import { WithStyles } from "@mui/styles";
import SpotifyWebApi from "spotify-web-api-node";
import { HomeLandingPageStyles, useHomeLandingPageStyles } from "./landing-page.styles";
import { FeaturedPlaylists } from "./featured-playlists/featured-playlists";
import { YoutubePlaylists } from "../youtube-playlists/playlist-component";
import { useYoutubeAuth } from "../../context/youtube-context";
import { useDeezerAuth } from "../../context/deezer-context";
import { useSpotifyAuth } from "../../context/spotify-context";
import { DeezerArtists } from "./deezer-artists/deezer-artists";
import { useAppContext } from "../../context/app-context";

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

interface InnerProps extends WithStyles<typeof HomeLandingPageStyles> {
  spotifyToken: string | null;
  deezerToken: string | null;
  youtubeToken: string | null;
  loading: boolean;
  setLoading: Function;
}

type Props = InnerProps & OuterProps;

class HomeLandingPageClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { classes, spotifyApi, spotifyToken, youtubeToken, deezerToken, setLoading, loading } = this.props;

    if (!spotifyToken && loading) {
      setLoading(false);
    }

    const shouldSetLoading = Boolean(youtubeToken || deezerToken);

    return (
      <Grid container={true} item={true} xs={12} className={classes.homeGrid}>
        {spotifyToken && <FeaturedPlaylists spotifyApi={spotifyApi} shouldSetLoading={!shouldSetLoading} />}
        {youtubeToken && <YoutubePlaylists shouldSetLoading={!deezerToken} />}
        {deezerToken && <DeezerArtists />}
      </Grid>
    );
  }
}

export const HomeLandingPage = React.memo<OuterProps>((props) => {
  const { youtubeToken } = useYoutubeAuth();
  const { deezerToken } = useDeezerAuth();
  const { spotifyToken } = useSpotifyAuth();
  const classes = useHomeLandingPageStyles();
  const { loading, setLoading } = useAppContext();

  return (
    <HomeLandingPageClass
      {...props}
      loading={loading}
      setLoading={setLoading}
      classes={classes}
      youtubeToken={youtubeToken}
      deezerToken={deezerToken}
      spotifyToken={spotifyToken}
    />
  );
});
