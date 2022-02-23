import * as React from "react";
import { Grid } from "@mui/material";
import { WithStyles } from "@mui/styles";
import SpotifyWebApi from "spotify-web-api-node";
import { HeaderComponent } from "./header/header-component";
import { HomeLandingPageStyles, useHomeLandingPageStyles } from "./landing-page.styles";
import { FeaturedPlaylists } from "./featured-playlists/featured-playlists";
import { YoutubePlaylists } from "../youtube-playlists/playlist-component";

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

type InnerProps = WithStyles<typeof HomeLandingPageStyles>;

type Props = InnerProps & OuterProps;

class HomeLandingPageClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { classes, spotifyApi } = this.props;

    return (
      <Grid container={true} item={true} xs={12} className={classes.homeGrid}>
        <HeaderComponent />
        <FeaturedPlaylists spotifyApi={spotifyApi} />
        <YoutubePlaylists />
      </Grid>
    );
  }
}

export const HomeLandingPage = React.memo<OuterProps>((props) => {
  const classes = useHomeLandingPageStyles();

  return <HomeLandingPageClass {...props} classes={classes} />;
});
