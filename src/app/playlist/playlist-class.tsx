import * as React from "react";
import { Grid } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { useLocation } from "react-router";
import SpotifyWebApi from "spotify-web-api-node";
import { FeaturedPlaylistState } from "../Home/featured-playlists/featured-card";
import { HeaderComponent } from "../Home/header/header-component";
import { HomeLandingPageStyles, useHomeLandingPageStyles } from "../Home/landing-page.styles";
import { Notify } from "../notification/notification-component";
import { PlaylistComponent } from "./playlist-component";

type PlaylistTracksResponse = SpotifyApi.PlaylistTrackResponse;

interface InnerProps extends WithStyles<typeof HomeLandingPageStyles> {
  playlist: SpotifyApi.PlaylistObjectSimplified;
  playlistTracks: PlaylistTracksResponse;
}

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

class PlaylistClass extends React.PureComponent<InnerProps> {
  public render(): React.ReactNode {
    const { classes, playlist, playlistTracks } = this.props;

    return (
      <Grid container={true} item={true} xs={12} className={classes.homeGrid}>
        <HeaderComponent />
        <PlaylistComponent playlist={playlist} playlistTracks={playlistTracks} />
      </Grid>
    );
  }
}

export const Playlist = React.memo<OuterProps>((props) => {
  const [playlistTracks, setTracks] = React.useState<PlaylistTracksResponse | undefined>();
  const location = useLocation();
  const locationState = location.state as FeaturedPlaylistState;
  const classes = useHomeLandingPageStyles();

  if (!locationState || !locationState.playlist) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  const { playlist } = locationState;
  const { spotifyApi } = props;

  React.useEffect(() => {
    spotifyApi
      .getPlaylistTracks(playlist.id)
      .then((value) => {
        setTracks(value.body);
      })
      .catch(() => {
        Notify("Unable to fetch Spotify data", "error");
      });
  }, [location.pathname]);

  if (!playlistTracks) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return <PlaylistClass playlist={playlist} playlistTracks={playlistTracks} classes={classes} />;
});
