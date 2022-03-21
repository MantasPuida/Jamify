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
import { TracksTableContent } from "./table-component";
import { SourceType } from "./playlist-component";

import "./fontFamily.css";

interface OuterProps {
  playlistTracks: SpotifyApi.PlaylistTrackResponse | gapi.client.youtube.PlaylistItemListResponse;
  spotifyApi: SpotifyWebApi;
  sourceType: SourceType;
}

interface InnerProps extends WithStyles<typeof PlaylistStyles> {}

type Props = InnerProps & OuterProps;

class TracksComponentClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { playlistTracks, classes, sourceType } = this.props;

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
                      <Typography className={classes.headerTypography}>Artists</Typography>
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
                  {sourceType === SourceType.Spotify &&
                    (playlistTracks as SpotifyApi.PlaylistTrackResponse).items.map((row) => {
                      if (!row || !row.track || !row.track.id || !row.track.album) {
                        const randomKey = Math.floor(Math.random() * 5000);
                        return <React.Fragment key={randomKey} />;
                      }

                      return <TracksTableContent row={row} key={row.track.id} sourceType={SourceType.Spotify} />;
                    })}

                  {sourceType === SourceType.Youtube &&
                    (playlistTracks as gapi.client.youtube.PlaylistItemListResponse).items?.map((row) => {
                      if (!row || !row.id || !row.snippet || !row.snippet.thumbnails) {
                        const randomKey = Math.floor(Math.random() * 5000);
                        return <React.Fragment key={randomKey} />;
                      }

                      return <TracksTableContent row={row} key={row.id} sourceType={SourceType.Youtube} />;
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
