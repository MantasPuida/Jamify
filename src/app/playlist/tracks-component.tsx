import * as React from "react";
import SpotifyWebApi from "spotify-web-api-node";
import {
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
  public render(): React.ReactNode {
    const { playlistTracks, classes } = this.props;

    return (
      <Grid container={true} className={classes.playlistsGrid}>
        <Grid item={true} xs={12}>
          <Paper sx={{ width: "100%", overflow: "hidden", backgroundColor: "black" }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ paddingLeft: 0 }}>
                      <Typography fontFamily="Poppins, sans-serif" fontSize={24} fontWeight={500} color="white">
                        Track
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontFamily="Poppins, sans-serif" fontSize={24} fontWeight={500} color="white">
                        Artist
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontFamily="Poppins, sans-serif" fontSize={24} fontWeight={500} color="white">
                        Album
                      </Typography>
                    </TableCell>
                    <TableCell style={{ paddingRight: 0 }}>
                      <Typography fontFamily="Poppins, sans-serif" fontSize={24} fontWeight={500} color="white">
                        Duration
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {playlistTracks.items.map((row) => (
                    <TableRow
                      sx={{ "& td": { border: "0", borderBottom: "1px solid rgba(255,255,255,0.1)" } }}
                      hover={true}
                      role="checkbox"
                      tabIndex={-1}
                      key={row.track.id}
                    >
                      <TableCell key={row.track.id} style={{ paddingLeft: 0 }}>
                        <img
                          src={row.track.album.images[0].url}
                          alt={row.track.name}
                          width={32}
                          style={{ float: "left" }}
                        />
                        <Typography
                          style={{ marginLeft: 40, height: "100%", marginTop: 4 }}
                          fontFamily="Poppins, sans-serif"
                          fontSize={16}
                          fontWeight={500}
                          color="white"
                        >
                          {row.track.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          fontFamily="Poppins, sans-serif"
                          fontSize={16}
                          style={{ color: "rgba(255, 255, 255, .7)" }}
                        >
                          {row.track.artists.map((artist, index) => {
                            const { length } = row.track.artists;
                            if (length > 1 && index < length - 1) {
                              return `${artist.name}, `;
                            }
                            return artist.name;
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          fontFamily="Poppins, sans-serif"
                          fontSize={16}
                          style={{ color: "rgba(255, 255, 255, .7)" }}
                        >
                          {row.track.album.name}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ textAlign: "end" }}>
                        <Typography
                          fontFamily="Poppins, sans-serif"
                          fontSize={16}
                          style={{ color: "rgba(255, 255, 255, .7)" }}
                        >
                          {Math.floor(row.track.duration_ms / 60000)}:
                          {((row.track.duration_ms % 60000) / 1000).toFixed(0)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
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
