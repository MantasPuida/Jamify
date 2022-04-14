import * as React from "react";
import { Checkbox, CheckboxProps, CircularProgress, FormControlLabel, Grid } from "@mui/material";
import { useLocation } from "react-router";
import { SourceType } from "../playlist-component";
import { Album, OmittedPlaylistResponse } from "../../../types/deezer.types";
import { PlaylistApi } from "../../../api/api-endpoints";
import { Notify } from "../../notification/notification-component";
import { useUserContext } from "../../../context/user-context";

interface PlaylistType {
  playlistId: string;
  playlistName: string;
  playlistImage: string;
  playlistDescription: string;
}

type DeezerPlaylistType = Album | OmittedPlaylistResponse;

interface OuterProps {
  artists?: string;
  playlist: PlaylistType;
  trackName: string;
  imageUrl: string;
  sourceType: SourceType;
  currentPlaylist:
    | SpotifyApi.PlaylistObjectSimplified
    | gapi.client.youtube.Playlist
    | PlaylistType
    | DeezerPlaylistType;
}

interface InnerProps {
  userId?: string;
  duration?: number;
}

type Props = OuterProps & InnerProps;

interface State {
  loading: boolean;
}

class MyOwnPlaylistCheckboxClass extends React.PureComponent<Props> {
  public state: State = { loading: false };

  private convertMilliseconds = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);

    let duration: string = minutes.toString();

    if (minutes < 10) {
      duration = `0${minutes}:`;
    }

    if (Number(seconds) < 10) {
      duration += `0${seconds}`;
    } else {
      duration += seconds;
    }

    return duration;
  };

  private handleOnChange: CheckboxProps["onChange"] = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const isChecked = event.currentTarget.checked;

    this.setState({ loading: true });

    const { TracksApiEndpoints } = PlaylistApi;
    const { userId, playlist, trackName, imageUrl, artists, duration } = this.props;

    let stringDuration = "";
    if (duration) {
      stringDuration = this.convertMilliseconds(duration);
    }

    if (isChecked && userId) {
      TracksApiEndpoints()
        .postTrack(userId, playlist.playlistId, {
          TrackName: trackName,
          ImageUrl: imageUrl,
          Album: playlist.playlistName,
          Artists: artists ?? "",
          Duration: stringDuration
        })
        .then(() => {
          Notify("Track has been added", "success");
        })
        .catch((error) => {
          Notify(error, "error");
        });
    } else if (!isChecked && userId) {
      TracksApiEndpoints()
        .fetchTracks(userId, playlist.playlistId)
        .then((tracks) => {
          const track = tracks.data.find((t) => t.trackName === trackName);
          if (track) {
            TracksApiEndpoints().deleteTrack(userId, playlist.playlistId, track.trackId);
          }
        })
        .then(() => {
          Notify("Track has been removed", "success");
        })
        .catch((error) => {
          Notify(error, "error");
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
          <FormControlLabel control={<Checkbox onChange={this.handleOnChange} />} label={playlist.playlistName} />
        </Grid>
      </Grid>
    );
  }
}

export const MyOwnPlaylistCheckbox = React.memo<OuterProps>((props) => {
  const [duration, setDuration] = React.useState<number>();
  const { userId } = useUserContext();
  const location = useLocation();
  const { trackName } = props;

  React.useEffect(() => {
    DZ.api(`search?q=track:${trackName}`, (response) => {
      if (response.data.length > 0) {
        const durationMs = response.data[0].duration;
        setDuration(durationMs);
      }
    });
  }, [location]);

  return <MyOwnPlaylistCheckboxClass duration={duration} userId={userId} {...props} />;
});
