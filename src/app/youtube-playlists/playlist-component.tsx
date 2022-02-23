/* eslint-disable arrow-body-style */
import { Grid } from "@mui/material";
import { WithStyles } from "@mui/styles";
import * as React from "react";
import { useYoutubeTracksStyles, YoutubeTracksStyles } from "./playlist.styles";

type InnerProps = WithStyles<typeof YoutubeTracksStyles>;

class YoutubePlaylistsClass extends React.PureComponent<InnerProps> {
  public render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <Grid item={true} xs={12} className={classes.youtubeTracksGrid}>
        YoutubePlaylists
      </Grid>
    );
  }
}

export const YoutubePlaylists = React.memo(() => {
  const classes = useYoutubeTracksStyles();
  //   const location = useLocation();
  //   const todaysHits = "RDCLAK5uy_nqRa4MZhGLlzdFysGGDQyuGA43aqJR8FQ";

  //   React.useEffect(() => {
  //     gapi.client.youtube.playlistItems
  //       .list({ playlistId: todaysHits, part: "snippet", maxResults: 200 })
  //       .then((value) => {
  //         console.log(value);
  //       });
  //   }, [location.pathname]);

  return <YoutubePlaylistsClass classes={classes} />;
});
