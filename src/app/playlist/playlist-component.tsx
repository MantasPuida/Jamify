import * as React from "react";
import Play from "mdi-material-ui/Play";
import { WithStyles } from "@mui/styles";
import { Button, Grid, Typography } from "@mui/material";
import { PlaylistStyles, usePlaylistStyles } from "./playlist.styles";

import "./fontFamily.css";

interface OuterProps {
  playlist: SpotifyApi.PlaylistObjectSimplified;
}

type InnerProps = WithStyles<typeof PlaylistStyles>;

type Props = InnerProps & OuterProps;

class PlaylistComponentClass extends React.PureComponent<Props> {
  private parseDescription = (description: string | null): string | null => {
    if (description) {
      if (description.includes("<") || description.includes(">")) {
        const regex: RegExp = /<[^>]*>/gm;
        return description.replaceAll(regex, "");
      }

      return description;
    }

    return null;
  };

  public render(): React.ReactNode {
    const { classes, playlist } = this.props;

    return (
      <Grid container={true} className={classes.playlistsGrid}>
        <Grid item={true} xs={4} style={{ maxWidth: "35%" }}>
          <img src={playlist.images[0].url} alt={playlist.name} className={classes.playlistImage} />
        </Grid>
        <Grid container={true} item={true} xs={8} className={classes.playlistGridText}>
          <Grid item={true}>
            <Typography fontFamily="Poppins, sans-serif" color="white" fontWeight={700} fontSize={45}>
              {playlist.name}
            </Typography>
          </Grid>
          <Grid item={true} style={{ width: "100%" }}>
            <Typography fontWeight={400} fontSize={16} style={{ color: "rgba(255, 255, 255, .7)" }}>
              {this.parseDescription(playlist.description)}
            </Typography>
          </Grid>
          <Grid item={true} style={{ width: "100%", marginTop: 40 }}>
            <Button
              style={{
                textTransform: "none",
                justifyContent: "left",
                backgroundColor: "white",
                color: "black",
                minWidth: 80,
                minHeight: 40
              }}
              startIcon={<Play />}
              variant="contained"
            >
              <Typography fontFamily="Poppins, sans-serif" color="black" fontWeight={500} fontSize={15}>
                Play
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const PlaylistTopComponent = React.memo<OuterProps>((props) => {
  const classes = usePlaylistStyles();

  return <PlaylistComponentClass classes={classes} {...props} />;
});
