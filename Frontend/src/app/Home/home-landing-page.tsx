/* eslint-disable no-unneeded-ternary */
import * as React from "react";
import { Grid } from "@mui/material";
import { WithStyles } from "@mui/styles";
import clsx from "clsx";
import SpotifyWebApi from "spotify-web-api-node";
import { useLocation } from "react-router";
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
}

interface State {
  forceUpdateYt: boolean;
  forceUpdateSp: boolean;
}

type Props = InnerProps & OuterProps;

class HomeLandingPageClass extends React.PureComponent<Props, State> {
  public state: State = { forceUpdateYt: false, forceUpdateSp: false };

  componentDidUpdate(prevProps: Props) {
    const { youtubeToken, spotifyToken } = this.props;

    if (!prevProps.youtubeToken && youtubeToken) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ forceUpdateYt: true });
    }

    if (!prevProps.spotifyToken && spotifyToken) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ forceUpdateSp: true });
    }
  }

  public render(): React.ReactNode {
    const { classes, spotifyApi, spotifyToken, youtubeToken, deezerToken } = this.props;
    const { forceUpdateYt, forceUpdateSp } = this.state;

    return (
      <Grid
        container={true}
        item={true}
        xs={12}
        className={clsx({ [classes.overflow]: deezerToken && youtubeToken }, classes.homeGrid)}>
        {spotifyToken && (
          <FeaturedPlaylists
            spotifyApi={spotifyApi}
            shouldSetLoading={forceUpdateSp ? forceUpdateSp : !youtubeToken || !deezerToken}
          />
        )}
        {youtubeToken && (
          <YoutubePlaylists
            shouldSetLoading={forceUpdateYt ? forceUpdateYt : !deezerToken || (!deezerToken && !spotifyToken)}
          />
        )}
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
  const location = useLocation();

  React.useEffect(() => {
    if (!spotifyToken && loading) {
      setLoading(false);
    }
  }, [location]);

  return (
    <HomeLandingPageClass
      {...props}
      classes={classes}
      youtubeToken={youtubeToken}
      deezerToken={deezerToken}
      spotifyToken={spotifyToken}
    />
  );
});
