import * as React from "react";
import { Grid } from "@mui/material";
import { WithStyles } from "@mui/styles";
import SpotifyWebApi from "spotify-web-api-node";
import { HeaderComponent } from "./header/header-component";
import { HomeLandingPageStyles, useHomeLandingPageStyles } from "./landing-page.styles";
import { FeaturedPlaylists } from "./featured-playlists/featured-playlists";
import { YoutubePlaylists } from "../youtube-playlists/playlist-component";
import { useYoutubeAuth } from "../../context/youtube-context";
import { useDeezerAuth } from "../../context/deezer-context";
import { useSpotifyAuth } from "../../context/spotify-context";
import { usePlayerContext } from "../../context/player-context";
import { Player } from "../player/player-component";

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

interface InnerProps extends WithStyles<typeof HomeLandingPageStyles> {
  spotifyToken: string | null;
  deezerToken: string | null;
  youtubeToken: string | null;
  isPlayerOpen: boolean;
}

type Props = InnerProps & OuterProps;

class HomeLandingPageClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { classes, spotifyApi, spotifyToken, youtubeToken, isPlayerOpen } = this.props;

    return (
      <Grid container={true} item={true} xs={12} className={classes.homeGrid}>
        <HeaderComponent spotifyApi={spotifyApi} />
        {spotifyToken && <FeaturedPlaylists spotifyApi={spotifyApi} />}
        {youtubeToken && <YoutubePlaylists />}
        {isPlayerOpen && <Player />}
      </Grid>
    );
  }
}

export const HomeLandingPage = React.memo<OuterProps>((props) => {
  const { youtubeToken } = useYoutubeAuth();
  const { deezerToken } = useDeezerAuth();
  const { spotifyToken } = useSpotifyAuth();
  const { isOpen } = usePlayerContext();
  const classes = useHomeLandingPageStyles();

  return (
    <HomeLandingPageClass
      {...props}
      isPlayerOpen={isOpen}
      classes={classes}
      youtubeToken={youtubeToken}
      deezerToken={deezerToken}
      spotifyToken={spotifyToken}
    />
  );
});
