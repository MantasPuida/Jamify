import * as React from "react";
import {
  Dialog,
  DialogProps,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Button,
  ButtonProps,
  Grid,
  TextField,
  TextFieldProps
} from "@mui/material";
import SpotifyWebApi from "spotify-web-api-node";
import Plus from "mdi-material-ui/Plus";
import { useLocation } from "react-router";
import { useSpotifyAuth } from "../../../context/spotify-context";
import { useYoutubeAuth } from "../../../context/youtube-context";
import { DialogContentDialog } from "./dialog-component";
import { PlaylistApi } from "../../../api/api-endpoints";
import { SourceType } from "../playlist-component";

interface PlaylistType {
  playlistId: string;
  playlistName: string;
  playlistImage: string;
  playlistDescription: string;
}

interface OuterProps {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  spotifyApi: SpotifyWebApi;
  imageUrl: string;
  trackName: string;
  userId?: string;
  sourceType: SourceType;
  currentPlaylist: SpotifyApi.PlaylistObjectSimplified | gapi.client.youtube.Playlist | PlaylistType;
}

interface InnerProps {
  fullScreen: boolean;
  spotifyPlaylists?: SpotifyApi.ListOfUsersPlaylistsResponse;
  youtubePlaylists?: gapi.client.youtube.PlaylistListResponse;
}

interface State {
  isClicked: boolean;
  text: string;
}

interface PlaylistReturnType {
  playlistId: string;
  playlistName: string;
  playlistImage: string;
  playlistDescription: string;
}

type Props = OuterProps & InnerProps;

class PlaylistsDialogComponentClass extends React.PureComponent<Props, State> {
  public state: State = { isClicked: false, text: "" };

  private onDialogClose: DialogProps["onClose"] = () => {
    const { setDialogOpen } = this.props;

    setDialogOpen(false);
  };

  private handleClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({ isClicked: true });
  };

  private handleOnTextChange: TextFieldProps["onChange"] = (event) => {
    event.stopPropagation();
    event.preventDefault();

    this.setState({ text: event.currentTarget.value });
  };

  private handleOnCreate: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { text } = this.state;
    const { userId, imageUrl, trackName: songName } = this.props;

    if (!userId || text.length < 1) {
      return;
    }

    const { PlaylistApiEndpoints, TracksApiEndpoints } = PlaylistApi;

    PlaylistApiEndpoints()
      .postPlaylist(userId, {
        PlaylistName: text,
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
            if (this.onDialogClose) {
              this.onDialogClose(event, "backdropClick");
            }
          });
      });
  };

  public render(): React.ReactNode {
    const {
      dialogOpen,
      fullScreen,
      spotifyPlaylists,
      youtubePlaylists,
      imageUrl,
      trackName,
      spotifyApi,
      currentPlaylist,
      sourceType
    } = this.props;
    const { isClicked } = this.state;

    return (
      <Dialog fullScreen={fullScreen} open={dialogOpen} onClose={this.onDialogClose}>
        <DialogTitle style={{ borderBottom: "1px solid lightgrey", paddingBottom: 8 }}>Save to...</DialogTitle>
        <DialogContent style={{ paddingTop: 16, borderBottom: "1px solid lightgrey" }}>
          <DialogContentDialog
            spotifyPlaylists={spotifyPlaylists}
            youtubePlaylists={youtubePlaylists}
            spotifyApi={spotifyApi}
            imageUrl={imageUrl}
            trackName={trackName}
            currentPlaylist={currentPlaylist}
            sourceType={sourceType}
          />
        </DialogContent>
        <DialogActions>
          {!isClicked && (
            <Button style={{ width: "100%", color: "black" }} startIcon={<Plus />} onClick={this.handleClick}>
              Create new playlist.
            </Button>
          )}
          {isClicked && (
            <Grid container={true}>
              <Grid item={true} xs={12}>
                <TextField
                  style={{ width: "100%" }}
                  label="Playlist Name"
                  variant="standard"
                  onChange={this.handleOnTextChange}
                />
              </Grid>
              <Grid item={true} xs={12} style={{ textAlign: "end", paddingTop: 16 }}>
                <Button onClick={this.handleOnCreate}>Create</Button>
              </Grid>
            </Grid>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

// eslint-disable-next-line arrow-body-style
export const PlaylistsDialogComponent = React.memo<OuterProps>((props) => {
  const [spotifyPlaylists, setSpotifyPlaylists] = React.useState<SpotifyApi.ListOfUsersPlaylistsResponse>();
  const [youtubePlaylists, setYoutubePlaylists] = React.useState<gapi.client.youtube.PlaylistListResponse>();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const { spotifyApi } = props;
  const { spotifyToken } = useSpotifyAuth();
  const { youtubeToken } = useYoutubeAuth();

  React.useEffect(() => {
    if (spotifyToken) {
      spotifyApi.getUserPlaylists().then((data) => setSpotifyPlaylists(data.body));
    }

    if (youtubeToken) {
      gapi.client.youtube.playlists
        .list({ part: "snippet", mine: true, maxResults: 99 })
        .then((data) => setYoutubePlaylists(data.result));
    }
  }, [location]);

  return (
    <PlaylistsDialogComponentClass
      spotifyPlaylists={spotifyPlaylists}
      youtubePlaylists={youtubePlaylists}
      fullScreen={fullScreen}
      {...props}
    />
  );
});
