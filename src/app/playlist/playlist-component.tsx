import * as React from "react";
import { WithStyles } from "@mui/styles";
import { Grid, Typography } from "@mui/material";
import { PlaylistStyles, usePlaylistStyles } from "./playlist.styles";

import "./fontFamily.css";

interface OuterProps {
  playlist: SpotifyApi.PlaylistObjectSimplified;
  playlistTracks?: SpotifyApi.PlaylistTrackResponse;
}

type InnerProps = WithStyles<typeof PlaylistStyles>;

type Props = InnerProps & OuterProps;

class PlaylistComponentClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { classes, playlist } = this.props;

    return (
      <Grid container={true} className={classes.PlaylistsGrid}>
        <Grid item={true} xs={4}>
          <img src={playlist.images[0].url} alt={playlist.name} />
        </Grid>
        <Grid item={true}>
          <Grid style={{ width: "100%", textAlign: "start" }}>
            <Typography fontFamily="Poppins, sans-serif" color="white">
              {playlist.name}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const PlaylistComponent = React.memo<OuterProps>((props) => {
  const classes = usePlaylistStyles();

  return <PlaylistComponentClass classes={classes} {...props} />;
});
