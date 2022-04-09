import * as React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  BottomNavigationProps,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";
import { useLocation } from "react-router";
import Spotify from "mdi-material-ui/Spotify";
import PlayCircleOutline from "mdi-material-ui/PlayCircleOutline";
import SpotifyWebApi from "spotify-web-api-node";
import { WithStyles } from "@mui/styles";
import { useDeezerAuth } from "../../../context/deezer-context";
import { useYoutubeAuth } from "../../../context/youtube-context";
import { useSpotifyAuth } from "../../../context/spotify-context";
import { HeaderSettingsDialogSpotify } from "../dialog-content/header-settings-dialog-spotify";
import { HeaderSettingsDialogYouTube } from "../dialog-content/header-settings-dialog-youtube";
import { HeaderSettingsDialogDeezer } from "../dialog-content/header-settings-dialog-deezer";
import { HeaderSettingsStyles, useHeaderSettingsStyles } from "./header-settings.styles";
import { DeezerIcon } from "./deezer-icon-svg";
// import { PlaylistApi } from "../../../api/api-endpoints";
import { useUserContext } from "../../../context/user-context";
// import { PlaylistType } from "../../me/me-component";

import "./fontFamily.css";

interface OuterProps {
  handleDialogClose: ButtonProps["onClick"];
  isDialogOpen: boolean;
  spotifyApi: SpotifyWebApi;
}

type BottomNavigationValues = "Spotify" | "YouTube" | "Deezer";

interface InnerProps extends WithStyles<typeof HeaderSettingsStyles> {
  setValue: React.Dispatch<React.SetStateAction<BottomNavigationValues>>;
  value: string;
  isDeezerConnected: boolean;
  isSpotifyConnected: boolean;
  isYoutubeConnected: boolean;
  youtubePlaylistCount: number;
  spotifyPlaylistCount: number;
  deezerPlaylistCount: number;
}

type Props = InnerProps & OuterProps;

class SettingsDialogClass extends React.PureComponent<Props> {
  private handleNavigationChange: BottomNavigationProps["onChange"] = (event, newValue) => {
    event.preventDefault();
    event.stopPropagation();

    const { setValue } = this.props;

    setValue(newValue);
  };

  public render(): React.ReactNode {
    const {
      isDialogOpen,
      handleDialogClose,
      value,
      isSpotifyConnected,
      isYoutubeConnected,
      isDeezerConnected,
      spotifyApi,
      youtubePlaylistCount,
      deezerPlaylistCount,
      spotifyPlaylistCount
    } = this.props;

    return (
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          <Typography fontFamily="Poppins,sans-serif" style={{ color: "black" }} fontSize={24}>
            {value} Profile
          </Typography>
        </DialogTitle>
        <DialogContent style={{ minWidth: 500, minHeight: 200 }}>
          {(value as BottomNavigationValues) === "Spotify" && (
            <HeaderSettingsDialogSpotify
              isSpotifyConnected={isSpotifyConnected}
              handleDialogClose={handleDialogClose}
              spotifyApi={spotifyApi}
              playlistCount={youtubePlaylistCount}
            />
          )}
          {(value as BottomNavigationValues) === "YouTube" && (
            <HeaderSettingsDialogYouTube
              isYoutubeConnected={isYoutubeConnected}
              handleDialogClose={handleDialogClose}
              playlistCount={spotifyPlaylistCount}
            />
          )}
          {(value as BottomNavigationValues) === "Deezer" && (
            <HeaderSettingsDialogDeezer
              isDeezerConnected={isDeezerConnected}
              handleDialogClose={handleDialogClose}
              playlistCount={deezerPlaylistCount}
            />
          )}
        </DialogContent>
        <DialogActions>
          <BottomNavigation sx={{ width: "100%" }} value={value} onChange={this.handleNavigationChange}>
            <BottomNavigationAction label="Spotify" value="Spotify" icon={<Spotify />} />
            <BottomNavigationAction label="Youtube" value="YouTube" icon={<PlayCircleOutline />} />
            <BottomNavigationAction label="Deezer" value="Deezer" icon={<DeezerIcon />} />
          </BottomNavigation>
        </DialogActions>
      </Dialog>
    );
  }
}

export const SettingsDialog = React.memo<OuterProps>((props) => {
  const [deezerPlaylistCount, setDeezerPlaylistCount] = React.useState<number>(0);
  const [youtubePlaylistCount, setYoutubePlaylistCount] = React.useState<number>(0);
  const [spotifyPlaylistCount, setSpotifyPlaylistCount] = React.useState<number>(0);
  const [value, setValue] = React.useState<BottomNavigationValues>("Spotify");
  const classes = useHeaderSettingsStyles();
  const { deezerToken } = useDeezerAuth();
  const { youtubeToken } = useYoutubeAuth();
  const { spotifyToken } = useSpotifyAuth();
  const { userId } = useUserContext();
  const location = useLocation();

  const { spotifyApi } = props;

  let isYoutubeConnected: boolean = false;
  let isDeezerConnected: boolean = false;
  let isSpotifyConnected: boolean = false;

  React.useEffect(() => {
    if (deezerToken) {
      DZ.api(`user/me/playlists?access_token=${deezerToken}`, (response) => {
        setDeezerPlaylistCount(response.total);
      });
    }

    if (youtubeToken && (!gapi || !gapi.client || !gapi.client.youtube || !gapi.client.youtube.playlists)) {
      setTimeout(() => {
        gapi.client.youtube.playlists
          .list({
            part: "snippet",
            mine: true,
            access_token: youtubeToken
          })
          .then((response) => {
            const { pageInfo } = response.result;
            if (pageInfo && pageInfo.totalResults) {
              setYoutubePlaylistCount(pageInfo.totalResults);
            }
          });
      }, 1000);
    } else if (youtubeToken && gapi && gapi.client && gapi.client.youtube && gapi.client.youtube.playlists) {
      gapi.client.youtube.playlists
        .list({
          part: "snippet",
          mine: true,
          access_token: youtubeToken
        })
        .then((response) => {
          const { pageInfo } = response.result;
          if (pageInfo && pageInfo.totalResults) {
            setYoutubePlaylistCount(pageInfo.totalResults);
          }
        });
    }

    if (spotifyToken) {
      spotifyApi.getUserPlaylists().then((response) => {
        setSpotifyPlaylistCount(response.body.total);
      });
    }

    if (userId) {
      // const { PlaylistApiEndpoints } = PlaylistApi;
    }
  }, [location.pathname]);

  if (deezerToken) {
    isDeezerConnected = true;
  }

  if (youtubeToken) {
    isYoutubeConnected = true;
  }

  if (spotifyToken) {
    isSpotifyConnected = true;
  }

  return (
    <SettingsDialogClass
      value={value}
      setValue={setValue}
      isDeezerConnected={isDeezerConnected}
      isYoutubeConnected={isYoutubeConnected}
      isSpotifyConnected={isSpotifyConnected}
      deezerPlaylistCount={deezerPlaylistCount}
      youtubePlaylistCount={youtubePlaylistCount}
      spotifyPlaylistCount={spotifyPlaylistCount}
      classes={classes}
      {...props}
    />
  );
});
