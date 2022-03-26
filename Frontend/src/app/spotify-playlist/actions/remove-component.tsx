import * as React from "react";
import { Button, Grid, Typography, ButtonProps } from "@mui/material";
import Delete from "mdi-material-ui/Delete";
import SpotifyWebApi from "spotify-web-api-node";
import { NavigateFunction, useNavigate } from "react-router";
import { AppRoutes } from "../../routes/routes";

interface OuterProps {
  songName: string;
  spotifyApi: SpotifyWebApi;
  currentPlaylist: SpotifyApi.PlaylistObjectSimplified;
  handleDialogClose: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

interface InnerProps {
  navigate: NavigateFunction;
}

type Props = InnerProps & OuterProps;

class RemoveComponentClass extends React.PureComponent<Props> {
  private handleSongDelete: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { spotifyApi, currentPlaylist, songName, handleDialogClose, navigate } = this.props;

    spotifyApi.getPlaylistTracks(currentPlaylist.id).then((tracksData) => {
      const tracks = tracksData.body;
      const track = tracks.items.filter((item) => item.track.name.includes(songName));

      if (track && track.length > 0)
        spotifyApi
          .removeTracksFromPlaylist(currentPlaylist.id, [
            {
              uri: track[0].track.uri
            }
          ])
          .then(() => {
            if (handleDialogClose) {
              handleDialogClose(event);
              navigate(AppRoutes.Me);
            }
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

export const RemoveComponent = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();

  return <RemoveComponentClass navigate={navigate} {...props} />;
});
