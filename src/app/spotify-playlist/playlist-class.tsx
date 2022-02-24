import * as React from "react";
import { Grid } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { useLocation } from "react-router";
import SpotifyWebApi from "spotify-web-api-node";
import { FeaturedPlaylistState } from "../Home/featured-playlists/featured-card";
import { HeaderComponent } from "../Home/header/header-component";
import { HomeLandingPageStyles, useHomeLandingPageStyles } from "../Home/landing-page.styles";
import { Notify } from "../notification/notification-component";
import { PlaylistTopComponent } from "./playlist-component";
import { TracksComponent } from "./tracks-component";
import { useSpotifyAuth } from "../../context/spotify-context";

type PlaylistTracksResponse = SpotifyApi.PlaylistTrackResponse;

interface InnerProps extends WithStyles<typeof HomeLandingPageStyles> {
  playlist: SpotifyApi.PlaylistObjectSimplified;
  playlistTracks: PlaylistTracksResponse;
}

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

type Props = InnerProps & OuterProps;

class PlaylistClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { classes, playlist, playlistTracks, spotifyApi } = this.props;

    return (
      <Grid container={true} item={true} xs={12} className={classes.homeGrid}>
        <HeaderComponent spotifyApi={spotifyApi} />
        <PlaylistTopComponent playlist={playlist} />
        <TracksComponent playlistTracks={playlistTracks} spotifyApi={spotifyApi} />
      </Grid>
    );
  }
}

export const Playlist = React.memo<OuterProps>((props) => {
  const [playlistTracks, setTracks] = React.useState<PlaylistTracksResponse | undefined>();
  const location = useLocation();
  const locationState = location.state as FeaturedPlaylistState;
  const classes = useHomeLandingPageStyles();
  const { logout } = useSpotifyAuth();

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
        logout();
        Notify("Unable to synchronize with Spotify", "error");
      });
  }, [location.pathname]);

  if (!playlistTracks) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return (
    <PlaylistClass playlist={playlist} playlistTracks={playlistTracks} classes={classes} spotifyApi={spotifyApi} />
  );
});
