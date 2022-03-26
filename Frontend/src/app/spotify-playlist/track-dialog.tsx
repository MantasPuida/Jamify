import * as React from "react";
import {
  BottomNavigationProps,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  BottomNavigation,
  BottomNavigationAction,
  Grid
} from "@mui/material";
import { useLocation } from "react-router";
import PlaylistPlus from "mdi-material-ui/PlaylistPlus";
import PlaylistRemove from "mdi-material-ui/PlaylistRemove";
import PencilOutline from "mdi-material-ui/PencilOutline";
import SpotifyWebApi from "spotify-web-api-node";
import { SpotifyPlaylistsMap } from "./spotify-playlists-map";
import { YoutubePlaylistsMap } from "./youtube-playlists-map";
import { RemoveComponent } from "./actions/remove-component";
import { SourceType } from "./playlist-component";
import { CreateComponent } from "./actions/create-component";
import { RemoveComponentYoutube } from "./actions/remove-component-yt";
import { RemoveComponentOwn } from "./actions/remove-component-own";

interface PlaylistType {
  playlistId: string;
  playlistName: string;
  playlistImage: string;
  playlistDescription: string;
}

interface OuterProps {
  isDialogOpen: boolean;
  handleDialogClose: ButtonProps["onClick"];
  spotifyApi: SpotifyWebApi;
  trackName: string;
  sourceType: SourceType;
  currentPlaylist: SpotifyApi.PlaylistObjectSimplified | gapi.client.youtube.Playlist | PlaylistType;
  imageUrl: string;
}

interface InnerProps {
  setBottomNavValue: React.Dispatch<React.SetStateAction<number>>;
  bottomNavVal: number;
  spotifyPlaylists?: SpotifyApi.ListOfUsersPlaylistsResponse;
  youtubePlaylists?: gapi.client.youtube.PlaylistListResponse;
}

type Props = InnerProps & OuterProps;

class TrackDialogClass extends React.PureComponent<Props> {
  private handleNavigationChange: BottomNavigationProps["onChange"] = (event, newValue) => {
    event.preventDefault();
    event.stopPropagation();

    const { setBottomNavValue } = this.props;

    setBottomNavValue(newValue);
  };

  private renderDialogContent = (): React.ReactNode => {
    const { bottomNavVal, spotifyPlaylists, youtubePlaylists, spotifyApi, trackName, handleDialogClose } = this.props;

    if (bottomNavVal === 0) {
      return (
        <Grid container={true}>
          <Grid item={true} style={{ display: "flex" }}>
            {spotifyPlaylists?.items.map((playlist) => (
              <SpotifyPlaylistsMap
                spotifyPlaylist={playlist}
                key={playlist.id}
                spotifyApi={spotifyApi}
                trackName={trackName}
                handleDialogClose={handleDialogClose}
              />
            ))}
          </Grid>
          <Grid item={true} style={{ display: "flex" }}>
            {youtubePlaylists?.items?.map((playlist) => (
              <YoutubePlaylistsMap youtubePlaylist={playlist} key={playlist.id} />
            ))}
          </Grid>
        </Grid>
      );
    }

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  };

  public render(): React.ReactNode {
    const {
      handleDialogClose,
      isDialogOpen,
      bottomNavVal,
      trackName,
      sourceType,
      spotifyApi,
      currentPlaylist,
      imageUrl
    } = this.props;

    let navVal = "";

    if (bottomNavVal === 0) {
      navVal = "Playlists";
    } else if (bottomNavVal === 1) {
      navVal = "Remove";
    } else {
      navVal = "Create";
    }

    return (
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{navVal}</DialogTitle>
        <DialogContent>
          {bottomNavVal === 0 && this.renderDialogContent()}
          {bottomNavVal === 1 && sourceType === SourceType.Spotify && (
            <RemoveComponent
              songName={trackName}
              spotifyApi={spotifyApi}
              currentPlaylist={currentPlaylist as SpotifyApi.PlaylistObjectSimplified}
              handleDialogClose={handleDialogClose}
            />
          )}
          {bottomNavVal === 1 && sourceType === SourceType.Youtube && (
            <RemoveComponentYoutube
              songName={trackName}
              currentPlaylist={currentPlaylist as gapi.client.youtube.Playlist}
              handleDialogClose={handleDialogClose}
            />
          )}
          {bottomNavVal === 1 && sourceType === SourceType.Own && (
            <RemoveComponentOwn
              songName={trackName}
              currentPlaylist={currentPlaylist as PlaylistType}
              handleDialogClose={handleDialogClose}
            />
          )}
          {bottomNavVal === 2 && sourceType === SourceType.Spotify && (
            <CreateComponent
              songName={trackName}
              spotifyApi={spotifyApi}
              currentPlaylist={currentPlaylist as SpotifyApi.PlaylistObjectSimplified}
              imageUrl={imageUrl}
              handleDialogClose={handleDialogClose}
            />
          )}
        </DialogContent>
        <DialogActions>
          <BottomNavigation
            sx={{ width: "100%", minWidth: 450 }}
            showLabels={true}
            value={bottomNavVal}
            onChange={this.handleNavigationChange}>
            <BottomNavigationAction label="Add Track" icon={<PlaylistPlus />} />
            <BottomNavigationAction label="Remove Track" icon={<PlaylistRemove />} />
            <BottomNavigationAction label="Create A Playlist" icon={<PencilOutline />} />
          </BottomNavigation>
        </DialogActions>
      </Dialog>
    );
  }
}

export const TrackDialog = React.memo<OuterProps>((props) => {
  const [bottomNavVal, setBottomNavValue] = React.useState<number>(0);
  const [spotifyPlaylists, setSpotifyPlaylists] = React.useState<SpotifyApi.ListOfUsersPlaylistsResponse>();
  const [youtubePlaylists, setYoutubePlaylists] = React.useState<gapi.client.youtube.PlaylistListResponse>();
  const location = useLocation();
  const { spotifyApi } = props;

  React.useEffect(() => {
    spotifyApi.getUserPlaylists().then((playlists) => {
      setSpotifyPlaylists(playlists.body);
    });

    gapi.client.youtube.playlists.list({ part: "snippet", mine: true, maxResults: 99 }).then((playlists) => {
      setYoutubePlaylists(playlists.result);
    });
  }, [location.pathname]);

  return (
    <TrackDialogClass
      bottomNavVal={bottomNavVal}
      spotifyPlaylists={spotifyPlaylists}
      youtubePlaylists={youtubePlaylists}
      setBottomNavValue={setBottomNavValue}
      {...props}
    />
  );
});
