import * as React from "react";
import { Button, Grid, Typography, ButtonProps } from "@mui/material";
import Delete from "mdi-material-ui/Delete";
import { NavigateFunction, useNavigate } from "react-router";
import { AppRoutes } from "../../routes/routes";
import { PlaylistType } from "../../me/me-component";
import { useUserContext } from "../../../context/user-context";
import { PlaylistApi } from "../../../api/api-endpoints";

interface TrackType {
  trackId: string;
  trackName: string;
  imageUrl: string;
  trackDescription: string;
  trackSource: string;
}

interface OuterProps {
  songName: string;
  currentPlaylist: PlaylistType;
  handleDialogClose: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

interface InnerProps {
  navigate: NavigateFunction;
  userId?: string;
}

type Props = InnerProps & OuterProps;

class RemoveComponentOwnClass extends React.PureComponent<Props> {
  private handleSongDelete: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { currentPlaylist, songName, handleDialogClose, navigate, userId } = this.props;
    const { TracksApiEndpoints } = PlaylistApi;

    if (!userId) {
      return;
    }

    TracksApiEndpoints()
      .fetchTracks(userId, currentPlaylist.playlistId)
      .then((tracksData) => {
        const tracks = tracksData.data as TrackType[];

        const track = tracks.filter((value) => value.trackName.includes(songName));

        if (track && track.length > 0) {
          TracksApiEndpoints()
            .deleteTrack(userId, currentPlaylist.playlistId, track[0].trackId)
            .then(() => {
              if (handleDialogClose) {
                handleDialogClose(event);
              }

              navigate(AppRoutes.Me);
            });
        }
      });
  };

  public render(): React.ReactNode {
    const { songName } = this.props;

    return (
      <Grid container={true}>
        <Grid item={true} container={true}>
          <Grid item={true} xs={12} style={{ paddingRight: 24 }}>
            <Typography>
              Click Delete if you want to remove <b>{songName}</b>.
            </Typography>
          </Grid>
          <Grid item={true} xs={12} style={{ textAlign: "end", paddingRight: 24, paddingBottom: 8, paddingTop: 24 }}>
            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={this.handleSongDelete}>
              Remove
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const RemoveComponentOwn = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();
  const { userId } = useUserContext();

  return <RemoveComponentOwnClass navigate={navigate} userId={userId} {...props} />;
});
