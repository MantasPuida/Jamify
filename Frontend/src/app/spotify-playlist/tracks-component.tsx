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
// eslint-disable-next-line import/no-cycle
import { TracksTableContent } from "./table-component";
import { SourceType } from "./playlist-component";
// eslint-disable-next-line import/no-cycle
import { TrackType } from "./playlist-class";
import { PlaylistType } from "../me/me-component";

import "./fontFamily.css";

interface OuterProps {
  playlistTracks: SpotifyApi.PlaylistTrackResponse | gapi.client.youtube.PlaylistItemListResponse | TrackType[];
  spotifyApi: SpotifyWebApi;
  sourceType: SourceType;
  playlist: SpotifyApi.PlaylistObjectSimplified | gapi.client.youtube.Playlist | PlaylistType;
  myOwn?: boolean;
}

interface InnerProps extends WithStyles<typeof PlaylistStyles> {}

type Props = InnerProps & OuterProps;

class TracksComponentClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { playlistTracks, classes, sourceType, spotifyApi, playlist, myOwn } = this.props;

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
                      <Typography className={classes.headerTypography}>
                        {sourceType === SourceType.Youtube ? "Channel" : "Artist"}
                      </Typography>
                    </TableCell>
                    {sourceType !== SourceType.Youtube && (
                      <TableCell>
                        <Typography className={classes.headerTypography}>Album</Typography>
                      </TableCell>
                    )}
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

                      return (
                        <TracksTableContent
                          row={row}
                          key={row.track.id}
                          sourceType={SourceType.Spotify}
                          spotifyApi={spotifyApi}
                          playlist={playlist}
                          myOwn={myOwn}
                        />
                      );
                    })}

                  {sourceType === SourceType.Youtube &&
                    (playlistTracks as gapi.client.youtube.PlaylistItemListResponse).items?.map((row) => {
                      if (!row || !row.id) {
                        const randomKey = Math.floor(Math.random() * 5000);
                        return <React.Fragment key={randomKey} />;
                      }

                      return (
                        <TracksTableContent
                          row={row}
                          key={row.id}
                          sourceType={SourceType.Youtube}
                          spotifyApi={spotifyApi}
                          playlist={playlist}
                          myOwn={myOwn}
                        />
                      );
                    })}

                  {sourceType === SourceType.Own &&
                    (playlistTracks as TrackType[]).map((row) => {
                      if (!row || !row.trackId) {
                        const randomKey = Math.floor(Math.random() * 5000);
                        return <React.Fragment key={randomKey} />;
                      }

                      return (
                        <TracksTableContent
                          row={row}
                          key={row.trackId}
                          albumName="random"
                          sourceType={SourceType.Own}
                          spotifyApi={spotifyApi}
                          playlist={playlist}
                          myOwn={myOwn}
                        />
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
