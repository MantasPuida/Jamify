import * as React from "react";
import { Grid, Backdrop, CircularProgress, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { SearchArtists } from "./search-mapped/search-artist";
import { SearchPlaylist } from "./search-mapped/search-playlist";
import { SearchTrack } from "./search-mapped/search-track";
import { SearchStyles } from "./search.styles";

interface OuterProps extends WithStyles<typeof SearchStyles> {
  tracks?: SpotifyApi.SearchResponse;
  artists?: SpotifyApi.SearchResponse;
  playlists?: SpotifyApi.SearchResponse;
  isLoading: boolean;
}

export class SearchComponentContent extends React.PureComponent<OuterProps> {
  public render(): React.ReactNode {
    const { artists, playlists, tracks, classes, isLoading } = this.props;
    let artistsCount = 0;
    let tracksCount = 0;
    let playlistsCount = 0;

    if (isLoading) {
      return (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress style={{ color: "white" }} />
        </Backdrop>
      );
    }

    return (
      <>
        {artists && artists.artists && artists.artists.items.length > 0 && (
          <Grid container={true} item={true} xs={12} className={classes.contentGrid}>
            <Grid item={true} xs={12}>
              <Typography fontSize={45} fontWeight={900} fontFamily="Poppins,sans-serif" color="white">
                Artists
              </Typography>
            </Grid>
            <Grid item={true} xs={12} style={{ display: "flex", maxWidth: "80%" }}>
              {artists.artists?.items.map((artist) => {
                if (!artist.id || !artist.name || !artist.images || artist.images.length === 0) {
                  return null;
                }

                artistsCount += 1;

                if (artistsCount > 7) {
                  return null;
                }

                return <SearchArtists artist={artist} key={artist.id} classes={classes} />;
              })}
            </Grid>
          </Grid>
        )}
        {playlists && playlists.playlists && playlists.playlists.items.length > 0 && (
          <Grid container={true} item={true} xs={12} className={classes.contentGrid}>
            <Grid item={true} xs={12}>
              <Typography fontSize={45} fontWeight={900} fontFamily="Poppins,sans-serif" color="white">
                Playlists
              </Typography>
            </Grid>
            <Grid item={true} xs={12} style={{ display: "flex", maxWidth: "80%" }}>
              {playlists.playlists?.items.map((playlist) => {
                if (!playlist.id || !playlist.name || !playlist.images || playlist.images.length === 0) {
                  return null;
                }

                playlistsCount += 1;

                if (playlistsCount > 7) {
                  return null;
                }

                return <SearchPlaylist playlist={playlist} key={playlist.id} classes={classes} />;
              })}
            </Grid>
          </Grid>
        )}
        {tracks && tracks.tracks && tracks.tracks.items.length > 0 && (
          <Grid container={true} item={true} xs={12} className={classes.contentGrid}>
            <Grid item={true} xs={12}>
              <Typography fontSize={45} fontWeight={900} fontFamily="Poppins,sans-serif" color="white">
                Tracks
              </Typography>
            </Grid>
            <Grid item={true} xs={12} style={{ display: "flex", maxWidth: "80%" }}>
              {tracks.tracks?.items.map((track) => {
                if (!track.id || !track.name || !track.album.images || track.album.images.length === 0) {
                  return null;
                }

                tracksCount += 1;

                if (tracksCount > 7) {
                  return null;
                }

                return <SearchTrack track={track} key={track.id} classes={classes} />;
              })}
            </Grid>
          </Grid>
        )}
      </>
    );
  }
}
