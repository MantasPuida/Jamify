import * as React from "react";
import { Checkbox, CheckboxProps, CircularProgress, FormControlLabel, Grid } from "@mui/material";
import SpotifyWebApi from "spotify-web-api-node";
import { SourceType } from "../playlist-component";
import { Album, OmittedPlaylistResponse } from "../../../types/deezer.types";
import { Notify } from "../../notification/notification-component";

interface PlaylistType {
  playlistId: string;
  playlistName: string;
  playlistImage: string;
  playlistDescription: string;
}

type DeezerPlaylistType = Album | OmittedPlaylistResponse;

interface OuterProps {
  playlist: SpotifyApi.PlaylistObjectSimplified;
  trackName: string;
  imageUrl: string;
  spotifyApi: SpotifyWebApi;
  sourceType: SourceType;
  currentPlaylist:
    | SpotifyApi.PlaylistObjectSimplified
    | gapi.client.youtube.Playlist
    | PlaylistType
    | DeezerPlaylistType;
}

interface State {
  loading: boolean;
}

class SpotifyPlaylistCheckboxClass extends React.PureComponent<OuterProps> {
  public state: State = { loading: false };

  private handleOnChange: CheckboxProps["onChange"] = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const isChecked = event.currentTarget.checked;

    this.setState({ loading: true });

    const { spotifyApi, trackName, playlist, currentPlaylist, sourceType } = this.props;

    if (sourceType === SourceType.Spotify) {
      const currPlaylist = currentPlaylist as SpotifyApi.PlaylistObjectSimplified;

      spotifyApi.getPlaylistTracks(currPlaylist.id).then((tracksData) => {
        const tracks = tracksData.body;

        const foundTrack = tracks.items.filter((value) => value.track.name.includes(trackName));
        if (foundTrack && foundTrack.length > 0) {
          if (isChecked) {
            spotifyApi
              .addTracksToPlaylist(playlist.id, [foundTrack[0].track.uri])
              .then(() => {
                Notify("Track has been added", "success");
              })
              .catch((err) => {
                Notify(err, "error");
              });
          } else if (!isChecked) {
            spotifyApi
              .removeTracksFromPlaylist(playlist.id, [
                {
                  uri: foundTrack[0].track.uri
                }
              ])
              .then(() => {
                Notify("Track has been removed", "success");
              })
              .catch((err) => {
                Notify(err, "error");
              });
          }
        }
      });
    } else {
      spotifyApi.searchTracks(trackName).then((tracksData) => {
        const { tracks } = tracksData.body;

        if (tracks && tracks.items.length > 0) {
          if (isChecked) {
            spotifyApi
              .addTracksToPlaylist(playlist.id, [tracks.items[0].uri])
              .then(() => {
                Notify("Track has been added", "success");
              })
              .catch((err) => {
                Notify(err, "error");
              });
          } else if (!isChecked) {
            spotifyApi
              .removeTracksFromPlaylist(playlist.id, [
                {
                  uri: tracks.items[0].uri
                }
              ])
              .then(() => {
                Notify("Track has been removed", "success");
              })
              .catch((err) => {
                Notify(err, "error");
              });
          }
        }
      });
    }

    this.setState({ loading: false });
  };

  public render(): React.ReactNode {
    const { playlist } = this.props;
    const { loading } = this.state;

    if (loading) {
      return <CircularProgress style={{ color: "black" }} />;
    }

    return (
      <Grid container={true}>
        <Grid item={true} xs={12}>
          <FormControlLabel control={<Checkbox onChange={this.handleOnChange} />} label={playlist.name} />
        </Grid>
      </Grid>
    );
  }
}

// eslint-disable-next-line arrow-body-style
export const SpotifyPlaylistCheckbox = React.memo<OuterProps>((props) => {
  return <SpotifyPlaylistCheckboxClass {...props} />;
});
