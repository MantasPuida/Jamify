import * as React from "react";
import { WithStyles } from "@mui/styles";
import { Grid } from "@mui/material";
import SpotifyWebApi from "spotify-web-api-node";
import { HomeLandingPageStyles, useHomeLandingPageStyles } from "../Home/landing-page.styles";

type InnerProps = WithStyles<typeof HomeLandingPageStyles>;

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

type Props = InnerProps & OuterProps;

class SearchClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <Grid container={true} item={true} xs={12} className={classes.homeGrid}>
        empty
      </Grid>
    );
  }
}

export const Search = React.memo<OuterProps>((props) => {
  const classes = useHomeLandingPageStyles();

  return <SearchClass classes={classes} {...props} />;
});
