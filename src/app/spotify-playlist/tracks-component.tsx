import * as React from "react";
import SpotifyWebApi from "spotify-web-api-node";
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import Play from "mdi-material-ui/Play";
import { WithStyles } from "@mui/styles";
import { PlaylistStyles, usePlaylistStyles } from "./playlist.styles";

import "./fontFamily.css";

interface OuterProps {
  playlistTracks: SpotifyApi.PlaylistTrackResponse;
  spotifyApi: SpotifyWebApi;
}

type InnerProps = WithStyles<typeof PlaylistStyles>;

type Props = InnerProps & OuterProps;

class TracksComponentClass extends React.PureComponent<Props> {
  private convertMilliseconds = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);

    let duration: string = minutes.toString();

    if (minutes < 10) {
      duration = `0${minutes}:`;
    }

    if (Number(seconds) < 10) {
      duration += `0${seconds}`;
    } else {
      duration += seconds;
    }

    return duration;
  };

  public render(): React.ReactNode {
    const { playlistTracks, classes } = this.props;

    return (
      <Grid container={true} className={classes.playlistsGrid}>
        <Grid item={true} xs={12}>
          <Paper className={classes.playlistPaperStyles}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.playlistFirstTableCell}>
                      <Typography className={classes.headerTypography}>Track</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography className={classes.headerTypography}>Artist</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography className={classes.headerTypography}>Album</Typography>
                    </TableCell>
                    <TableCell className={classes.playlistLastTableCell}>
                      <Typography className={classes.headerTypography}>Duration</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {playlistTracks.items.map((row) => {
                    if (!row || !row.track || !row.track.id || !row.track.album) {
                      const randomKey = Math.floor(Math.random() * 5000);
                      return <React.Fragment key={randomKey} />;
                    }

                    return (
                      <TableRow
                        classes={{ hover: classes.hover }}
                        hover={true}
                        role="checkbox"
                        tabIndex={-1}
                        key={row.track.id}
                      >
                        <TableCell key={row.track.id} style={{ paddingLeft: 0, minWidth: 350, maxWidth: 550 }}>
                          <Button style={{ padding: 0, color: "transparent" }}>
                            <img
                              className={classes.playlistImageStyle}
                              src={row.track.album.images[0].url}
                              alt={row.track.name}
                              width={40}
                              id="rowTrackImage"
                            />
                            <div className={classes.playlistIconButton}>
                              <Play id="playSvgIcon" className={classes.playlistIconButtonIcon} />
                            </div>
                          </Button>
                          <Button className={classes.buttonText} variant="text">
                            <Typography
                              style={{ height: "100%", marginTop: 4 }}
                              fontFamily="Poppins, sans-serif"
                              fontSize={16}
                              fontWeight={500}
                              color="white"
                            >
                              {row.track.name}
                            </Typography>
                          </Button>
                        </TableCell>
                        <TableCell className={classes.artistTableCell}>
                          <Button className={classes.buttonTextHover} variant="text">
                            <Typography
                              fontFamily="Poppins, sans-serif"
                              fontSize={16}
                              className={classes.artistTypography}
                            >
                              {row.track.artists.map((artist, index) => {
                                const { length } = row.track.artists;
                                if (length > 1 && index < length - 1) {
                                  return `${artist.name}, `;
                                }
                                return artist.name;
                              })}
                            </Typography>
                          </Button>
                        </TableCell>
                        <TableCell style={{ minWidth: 500 }}>
                          <Button className={classes.buttonTextHover} variant="text">
                            <Typography
                              fontFamily="Poppins, sans-serif"
                              fontSize={16}
                              className={classes.artistTypography}
                            >
                              {row.track.album.name}
                            </Typography>
                          </Button>
                        </TableCell>
                        <TableCell style={{ textAlign: "end" }}>
                          <Typography
                            fontFamily="Poppins, sans-serif"
                            fontSize={16}
                            className={classes.artistTypography}
                          >
                            {this.convertMilliseconds(row.track.duration_ms)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export const TracksComponent = React.memo<OuterProps>((props) => {
  const classes = usePlaylistStyles();

  return <TracksComponentClass {...props} classes={classes} />;
});
