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
import {
  Album,
  ArtistAlbumsData,
  ArtistAlbumsResponse,
  PlaylistsResponse,
  PlaylistTracksData,
  PlaylistTracksResponse
} from "../../types/deezer.types";
import { useAppContext } from "../../context/app-context";

import "./fontFamily.css";

type DeezerPlaylistType = Album | PlaylistsResponse;
type DeezerPlaylistTrackType = ArtistAlbumsResponse | PlaylistTracksResponse;

interface OuterProps {
  playlist: SpotifyApi.PlaylistObjectSimplified | gapi.client.youtube.Playlist | PlaylistType | DeezerPlaylistType;
  playlistTracks:
    | SpotifyApi.PlaylistTrackResponse
    | gapi.client.youtube.PlaylistItemListResponse
    | TrackType[]
    | DeezerPlaylistTrackType;
  spotifyApi: SpotifyWebApi;
  sourceType: SourceType;
  myOwn?: boolean;
}

interface InnerProps extends WithStyles<typeof PlaylistStyles> {
  setLoading: Function;
}

type Props = InnerProps & OuterProps;

class TracksComponentClass extends React.PureComponent<Props> {
  componentDidMount() {
    const { setLoading } = this.props;

    setLoading(false);
  }

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
                    (playlistTracks as SpotifyApi.PlaylistTrackResponse).items.map((row, trackIndex) => {
                      if (!row || !row.track || !row.track.id || !row.track.album) {
                        const randomKey = Math.floor(Math.random() * 5000);
                        return <React.Fragment key={randomKey} />;
                      }

                      return (
                        <TracksTableContent
                          trackIndex={trackIndex + 1}
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
                    (playlistTracks as gapi.client.youtube.PlaylistItemListResponse).items?.map((row, trackIndex) => {
                      if (!row || !row.id) {
                        const randomKey = Math.floor(Math.random() * 5000);
                        return <React.Fragment key={randomKey} />;
                      }

                      return (
                        <TracksTableContent
                          trackIndex={trackIndex + 1}
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
                    (playlistTracks as TrackType[]).map((row, trackIndex) => {
                      if (!row || !row.trackId) {
                        const randomKey = Math.floor(Math.random() * 5000);
                        return <React.Fragment key={randomKey} />;
                      }

                      return (
                        <TracksTableContent
                          trackIndex={trackIndex + 1}
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

                  {sourceType === SourceType.Deezer &&
                    (playlistTracks as DeezerPlaylistTrackType).data.map((row, trackIndex) => {
                      if (!row || !row.id) {
                        const randomKey = Math.floor(Math.random() * 5000);
                        return <React.Fragment key={randomKey} />;
                      }

                      if (row.type === "album") {
                        const currentRow = row as ArtistAlbumsData;

                        return (
                          <TracksTableContent
                            trackIndex={trackIndex + 1}
                            row={currentRow}
                            key={currentRow.id}
                            albumName="random"
                            sourceType={SourceType.Deezer}
                            spotifyApi={spotifyApi}
                            playlist={playlist}
                            myOwn={myOwn}
                          />
                        );
                      }

                      const currentRow = row as PlaylistTracksData;

                      return (
                        <TracksTableContent
                          trackIndex={trackIndex + 1}
                          row={currentRow}
                          key={currentRow.id}
                          albumName="random"
                          sourceType={SourceType.Deezer}
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
  const { setLoading } = useAppContext();

  return <TracksComponentClass setLoading={setLoading} {...props} classes={classes} />;
});
