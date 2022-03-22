import * as React from "react";
import { Grid } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { useLocation } from "react-router";
import SpotifyWebApi from "spotify-web-api-node";
import { FeaturedPlaylistState } from "../Home/featured-playlists/featured-card";
import { HomeLandingPageStyles, useHomeLandingPageStyles } from "../Home/landing-page.styles";
import { Notify } from "../notification/notification-component";
import { PlaylistTopComponent, SourceType } from "./playlist-component";
import { TracksComponent } from "./tracks-component";
import { useSpotifyAuth } from "../../context/spotify-context";

type PlaylistTracksResponse = SpotifyApi.PlaylistTrackResponse;

interface InnerProps extends WithStyles<typeof HomeLandingPageStyles> {
  playlist: SpotifyApi.PlaylistObjectSimplified | gapi.client.youtube.Playlist;
  playlistTracks: PlaylistTracksResponse | gapi.client.youtube.PlaylistItemListResponse;
  sourceType: SourceType;
}

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

type Props = InnerProps & OuterProps;

class PlaylistClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { classes, playlist, playlistTracks, spotifyApi, sourceType } = this.props;

    return (
      <Grid container={true} item={true} xs={12} className={classes.homeGrid}>
        <PlaylistTopComponent playlist={playlist} sourceType={sourceType} />
        <TracksComponent playlistTracks={playlistTracks} spotifyApi={spotifyApi} sourceType={sourceType} />
      </Grid>
    );
  }
}

export const Playlist = React.memo<OuterProps>((props) => {
  const [playlistTracks, setTracks] = React.useState<PlaylistTracksResponse | undefined>();
  const [youtubePlaylistTracks, setYoutubePlaylistTracks] = React.useState<
    gapi.client.youtube.PlaylistItemListResponse | undefined
  >();
  const location = useLocation();
  const locationState = location.state as FeaturedPlaylistState;
  const classes = useHomeLandingPageStyles();
  const { logout } = useSpotifyAuth();

  if (!locationState || (!locationState.spotifyPlaylist && !locationState.youtubePlaylist)) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  const { spotifyPlaylist, youtubePlaylist } = locationState;
  const { spotifyApi } = props;

  React.useEffect(() => {
    if (spotifyPlaylist) {
      spotifyApi
        .getPlaylistTracks(spotifyPlaylist.id)
        .then((value) => {
          setTracks(value.body);
        })
        .catch(() => {
          logout();
          Notify("Unable to synchronize with Spotify", "error");
        });
    } else if (youtubePlaylist) {
      gapi.client.youtube.playlistItems
        .list({
          part: "snippet",
          playlistId: youtubePlaylist.id,
          maxResults: 999
        })
        .then((playlistItems) => {
          setYoutubePlaylistTracks(playlistItems.result);
        });
    }
  }, [location.pathname]);

  if (youtubePlaylist && youtubePlaylistTracks) {
    return (
      <PlaylistClass
        playlist={youtubePlaylist}
        playlistTracks={youtubePlaylistTracks}
        classes={classes}
        spotifyApi={spotifyApi}
        sourceType={SourceType.Youtube}
      />
    );
  }

  if (spotifyPlaylist && playlistTracks) {
    return (
      <PlaylistClass
        playlist={spotifyPlaylist}
        playlistTracks={playlistTracks}
        classes={classes}
        spotifyApi={spotifyApi}
        sourceType={SourceType.Spotify}
      />
    );
  }

  if (!playlistTracks || !spotifyPlaylist) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return (
    <PlaylistClass
      playlist={spotifyPlaylist}
      playlistTracks={playlistTracks}
      classes={classes}
      spotifyApi={spotifyApi}
      sourceType={SourceType.Spotify}
    />
  );
});
