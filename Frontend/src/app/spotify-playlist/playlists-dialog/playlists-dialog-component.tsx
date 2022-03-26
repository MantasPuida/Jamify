import * as React from "react";
import { Dialog, DialogProps, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from "@mui/material";
import SpotifyWebApi from "spotify-web-api-node";
import { useLocation } from "react-router";
import { useSpotifyAuth } from "../../../context/spotify-context";
import { useYoutubeAuth } from "../../../context/youtube-context";
import { DialogContentDialog } from "./dialog-component";

interface OuterProps {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  spotifyApi: SpotifyWebApi;
}

interface InnerProps {
  fullScreen: boolean;
  spotifyPlaylists?: SpotifyApi.ListOfUsersPlaylistsResponse;
  youtubePlaylists?: gapi.client.youtube.PlaylistListResponse;
}

type Props = OuterProps & InnerProps;

class PlaylistsDialogComponentClass extends React.PureComponent<Props> {
  private onDialogClose: DialogProps["onClose"] = () => {
    const { setDialogOpen } = this.props;

    setDialogOpen(false);
  };

  public render(): React.ReactNode {
    const { dialogOpen, fullScreen, spotifyPlaylists, youtubePlaylists } = this.props;

    return (
      <Dialog fullScreen={fullScreen} open={dialogOpen} onClose={this.onDialogClose}>
        <DialogTitle>Save to...</DialogTitle>
        <DialogContent>
          <DialogContentDialog spotifyPlaylists={spotifyPlaylists} youtubePlaylists={youtubePlaylists} />
        </DialogContent>
        <DialogActions>Create a playlist</DialogActions>
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
