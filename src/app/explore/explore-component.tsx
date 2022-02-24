import { Grid } from "@mui/material";
import { WithStyles } from "@mui/styles";
import * as React from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { HeaderComponent } from "../Home/header/header-component";
import { HomeLandingPageStyles, useHomeLandingPageStyles } from "../Home/landing-page.styles";

type InnerProps = WithStyles<typeof HomeLandingPageStyles>;

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

type Props = InnerProps & OuterProps;

class ExploreClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { classes, spotifyApi } = this.props;

    return (
      <Grid container={true} item={true} xs={12} className={classes.homeGrid}>
        <HeaderComponent spotifyApi={spotifyApi} />
      </Grid>
    );
  }
}

export const Explore = React.memo<OuterProps>((props) => {
  const classes = useHomeLandingPageStyles();

  return <ExploreClass classes={classes} {...props} />;
});
