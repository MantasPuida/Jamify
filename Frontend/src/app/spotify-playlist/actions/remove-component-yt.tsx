import * as React from "react";
import { Button, Grid, Typography, ButtonProps } from "@mui/material";
import Delete from "mdi-material-ui/Delete";
import { NavigateFunction, useNavigate } from "react-router";
import { AppRoutes } from "../../routes/routes";

interface OuterProps {
  songName: string;
  currentPlaylist: gapi.client.youtube.Playlist;
  handleDialogClose: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

interface InnerProps {
  navigate: NavigateFunction;
}

type Props = InnerProps & OuterProps;

class RemoveComponentYoutubeClass extends React.PureComponent<Props> {
  private handleSongDelete: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { currentPlaylist, songName, handleDialogClose, navigate } = this.props;

    gapi.client.youtube.playlistItems
      .list({
        part: "snippet",
        playlistId: currentPlaylist.id,
        maxResults: 99
      })
      .then((itemsData) => {
        const items = itemsData.result;

        const currentTrack = items.items?.filter((value) => value.snippet?.title?.includes(songName));
        if (!currentTrack || !currentTrack[0].id || !handleDialogClose) {
          return;
        }

        gapi.client.youtube.playlistItems
          .delete({
            id: currentTrack[0].id
          })
          .then(() => {
            handleDialogClose(event);
            navigate(AppRoutes.Me);
          });
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

export const RemoveComponentYoutube = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();

  return <RemoveComponentYoutubeClass navigate={navigate} {...props} />;
});
