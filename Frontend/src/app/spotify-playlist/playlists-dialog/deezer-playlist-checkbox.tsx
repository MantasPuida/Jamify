import * as React from "react";
import { Checkbox, CheckboxProps, CircularProgress, FormControlLabel, Grid } from "@mui/material";
import { SourceType } from "../playlist-component";
import { Album, OmittedPlaylistResponse, TrackListData, Tracks } from "../../../types/deezer.types";
import { useDeezerAuth } from "../../../context/deezer-context";
import { Notify } from "../../notification/notification-component";

interface PlaylistType {
  playlistId: string;
  playlistName: string;
  playlistImage: string;
  playlistDescription: string;
}

type DeezerPlaylistType = Album | OmittedPlaylistResponse;

interface OuterProps {
  playlist: OmittedPlaylistResponse;
  trackName: string;
  imageUrl: string;
  sourceType: SourceType;
  currentPlaylist:
    | SpotifyApi.PlaylistObjectSimplified
    | gapi.client.youtube.Playlist
    | PlaylistType
    | DeezerPlaylistType;
  deezerTrack?: TrackListData;
  artists?: string;
}

interface InnerProps {
  deezerToken: string | null;
}

type Props = OuterProps & InnerProps;

interface State {
  loading: boolean;
}

class DeezerPlaylistCheckboxClass extends React.PureComponent<Props> {
  public state: State = { loading: false };

  private handleOnChange: CheckboxProps["onChange"] = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const isChecked = event.currentTarget.checked;

    this.setState({ loading: true });

    const { playlist, deezerTrack, deezerToken, sourceType, trackName, artists } = this.props;

    if (sourceType === SourceType.Deezer) {
      if (isChecked && deezerToken) {
        DZ.api(
          `playlist/${playlist.id}/tracks?access_token=${deezerToken}`,
          "POST",
          {
            songs: [deezerTrack?.id]
          },
          (callback) => {
            if (callback.error) {
              Notify(callback.error.message, "error");
            } else {
              Notify("Track has been added", "success");
            }
          }
        );
      } else if (!isChecked && deezerToken && deezerTrack?.id) {
        DZ.api(
          `playlist/${playlist.id}/tracks?access_token=${deezerToken}`,
          "DELETE",
          {
            songs: [deezerTrack.id]
          },
          (callback) => {
            if (callback.error) {
              Notify(callback.error.message, "error");
            } else {
              Notify("Track has been removed", "success");
            }
          }
        );
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      let artistsQ = "";
      if (artists) {
        artistsQ = artists;
      }

      DZ.api(`search?q=${trackName} - ${artistsQ}?strict=on`, (responseData) => {
        const response = responseData as Tracks;
        let relevantTrack = response.data.filter(
          (track) => track.type === "track" && track.title.toLowerCase() === trackName.toLowerCase()
        );

        if (relevantTrack.length === 0) {
          relevantTrack = response.data.filter((track) => track.type === "track");
        }

        if (isChecked) {
          DZ.api(
            `playlist/${playlist.id}/tracks?access_token=${deezerToken}`,
            "POST",
            {
              songs: [relevantTrack[0].id]
            },
            (callback) => {
              if (callback.error) {
                Notify(callback.error.message, "error");
              } else {
                Notify("Track has been added", "success");
              }
            }
          );
        } else if (!isChecked) {
          DZ.api(
            `playlist/${playlist.id}/tracks?access_token=${deezerToken}`,
            "DELETE",
            {
              songs: [relevantTrack[0].id]
            },
            (callback) => {
              if (callback.error) {
                Notify(callback.error.message, "error");
              } else {
                Notify("Track has been removed", "success");
              }
            }
          );
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
          <FormControlLabel control={<Checkbox onChange={this.handleOnChange} />} label={playlist.title} />
        </Grid>
      </Grid>
    );
  }
}

// eslint-disable-next-line arrow-body-style
export const DeezerPlaylistCheckbox = React.memo<OuterProps>((props) => {
  const { deezerToken } = useDeezerAuth();
  return <DeezerPlaylistCheckboxClass deezerToken={deezerToken} {...props} />;
});
