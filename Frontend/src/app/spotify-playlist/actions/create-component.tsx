import * as React from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { Grid, TextField, TextFieldProps, Button, ButtonProps, Typography } from "@mui/material";
import PencilPlus from "mdi-material-ui/PencilPlus";
import { PlaylistApi } from "../../../api/api-endpoints";
import { useUserContext } from "../../../context/user-context";

interface State {
  playlistName: string;
}

interface PlaylistReturnType {
  playlistId: string;
  playlistName: string;
  playlistImage: string;
  playlistDescription: string;
}

interface OuterProps {
  spotifyApi: SpotifyWebApi;
  songName: string;
  currentPlaylist: SpotifyApi.PlaylistObjectSimplified;
  imageUrl: string;
  handleDialogClose: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

interface InnerProps {
  userId?: string;
}

type Props = OuterProps & InnerProps;

class CreateComponentClass extends React.PureComponent<Props, State> {
  public state: State = { playlistName: "" };

  private handleOnChange: TextFieldProps["onChange"] = (event) => {
    this.setState({ playlistName: event.currentTarget.value });
  };

  private handleOnSubmit: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { playlistName } = this.state;
    const { userId, songName, imageUrl, handleDialogClose } = this.props;

    if (!userId || playlistName.length < 1 || !handleDialogClose) {
      return;
    }

    const { PlaylistApiEndpoints, TracksApiEndpoints } = PlaylistApi;

    PlaylistApiEndpoints()
      .postPlaylist(userId, {
        PlaylistName: playlistName,
        PlaylistDescription: "",
        PlaylistImage: imageUrl
      })
      .then((playlistData) => {
        const playlist = playlistData.data as PlaylistReturnType;

        TracksApiEndpoints()
          .postTrack(userId, playlist.playlistId, {
            ImageUrl: imageUrl,
            TrackDescription: "",
            TrackName: songName,
            TrackSource: "Spotify"
          })
          .then(() => {
            handleDialogClose(event);
          });
      });
  };

  public render(): React.ReactNode {
    return (
      <Grid container={true}>
        <Grid item={true} xs={12}>
          <Typography>To create a playlist, fill in the required field.</Typography>
        </Grid>
        <Grid item={true} xs={12} style={{ paddingTop: 16, paddingBottom: 16 }}>
          <TextField size="small" label="Playlist Name" onChange={this.handleOnChange} />
        </Grid>
        <Grid item={true} xs={12} style={{ paddingTop: 16, paddingBottom: 16, textAlign: "end" }}>
          <Button
            variant="outlined"
            style={{ color: "orange", borderColor: "orange", paddingRight: 24 }}
            onClick={this.handleOnSubmit}
            startIcon={<PencilPlus />}>
            Submit
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export const CreateComponent = React.memo<OuterProps>((props) => {
  const { userId } = useUserContext();

  return <CreateComponentClass userId={userId} {...props} />;
});
