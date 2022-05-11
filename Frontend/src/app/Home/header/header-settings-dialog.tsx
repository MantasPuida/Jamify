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
  Typography,
  IconButton,
  Tooltip,
  IconButtonProps
} from "@mui/material";
import { useLocation, useNavigate, NavigateFunction } from "react-router";
import Spotify from "mdi-material-ui/Spotify";
import PlayCircleOutline from "mdi-material-ui/PlayCircleOutline";
import LogoutVariant from "mdi-material-ui/LogoutVariant";
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
import { useYoutubeApiContext } from "../../../context/youtube-api-context";

import "./fontFamily.css";
import { useAppContext } from "../../../context/app-context";

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
  spotifyPlaylistCount?: number;
  deezerPlaylistCount: number;
  dzLogout: () => void;
  spLogout: () => void;
  ytLogout: () => void;
  setIsSpotifyConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setIsYoutubeConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeezerConnected: React.Dispatch<React.SetStateAction<boolean>>;
  googleAuthObject: gapi.auth2.GoogleAuthBase | undefined;
  navigate: NavigateFunction;
  setLoading: Function;
}

type Props = InnerProps & OuterProps;

class SettingsDialogClass extends React.PureComponent<Props> {
  private handleNavigationChange: BottomNavigationProps["onChange"] = (event, newValue) => {
    event.preventDefault();
    event.stopPropagation();

    const { setValue } = this.props;

    setValue(newValue);
  };

  private handleOnClickLogout: IconButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const {
      handleDialogClose,
      value,
      spotifyApi,
      spLogout,
      navigate,
      setIsSpotifyConnected,
      ytLogout,
      googleAuthObject,
      setIsYoutubeConnected,
      setIsDeezerConnected,
      dzLogout,
      setLoading
    } = this.props;

    const currentValue = value as BottomNavigationValues;

    setLoading(true);

    if (currentValue === "Spotify") {
      if (handleDialogClose) {
        handleDialogClose(event);
      }

      spotifyApi.resetCredentials();
      setTimeout(() => {
        const logoutWindow = window.open(
          "https://accounts.spotify.com/logout",
          "_blank",
          "toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=10000, top=10000, width=10, height=10, visible=none"
        );

        if (logoutWindow) {
          setTimeout(() => {
            logoutWindow.close();
          }, 100);
        }

        setIsSpotifyConnected(false);
        spLogout();
        navigate("/", { replace: true });
      }, 500);
    } else if (currentValue === "YouTube") {
      if (handleDialogClose) {
        handleDialogClose(event);
      }

      setTimeout(() => {
        if (googleAuthObject) {
          googleAuthObject.signOut();
          googleAuthObject.disconnect();
        }

        setIsYoutubeConnected(false);
        ytLogout();
        navigate("/", { replace: true });
      }, 500);
    } else if (currentValue === "Deezer") {
      if (handleDialogClose) {
        handleDialogClose(event);
      }

      setTimeout(() => {
        setIsDeezerConnected(false);
        dzLogout();
        navigate("/", { replace: true });
      }, 500);
    }
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
      spotifyPlaylistCount,
      classes
    } = this.props;

    const shouldRenderSp =
      isSpotifyConnected && (value as BottomNavigationValues) === "Spotify" && spotifyPlaylistCount;
    const shouldRenderYt = isYoutubeConnected && (value as BottomNavigationValues) === "YouTube";
    const shouldRenderDz = isDeezerConnected && (value as BottomNavigationValues) === "Deezer";

    return (
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title" style={{ textAlignLast: "end" }}>
          <Typography fontFamily="Poppins,sans-serif" style={{ color: "black", float: "left" }} fontSize={24}>
            {value} Profile
          </Typography>
          {shouldRenderSp && (
            <Tooltip
              title="Logout"
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "black",
                    color: "white",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 12
                  }
                }
              }}>
              <IconButton size="large" style={{ padding: 1 }} onClick={this.handleOnClickLogout}>
                <LogoutVariant style={{ color: "black" }} />
              </IconButton>
            </Tooltip>
          )}
          {shouldRenderYt && (
            <Tooltip
              title="Logout"
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "black",
                    color: "white",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 12
                  }
                }
              }}>
              <IconButton size="large" style={{ padding: 1 }} onClick={this.handleOnClickLogout}>
                <LogoutVariant style={{ color: "black" }} />
              </IconButton>
            </Tooltip>
          )}
          {shouldRenderDz && (
            <Tooltip
              title="Logout"
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "black",
                    color: "white",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 12
                  }
                }
              }}>
              <IconButton size="large" style={{ padding: 1 }} onClick={this.handleOnClickLogout}>
                <LogoutVariant style={{ color: "black" }} />
              </IconButton>
            </Tooltip>
          )}
        </DialogTitle>
        <DialogContent className={classes.dialogContentStyles}>
          {(value as BottomNavigationValues) === "Spotify" && (
            <HeaderSettingsDialogSpotify
              isSpotifyConnected={isSpotifyConnected}
              handleDialogClose={handleDialogClose}
              spotifyApi={spotifyApi}
              playlistCount={spotifyPlaylistCount ?? 0}
            />
          )}
          {(value as BottomNavigationValues) === "YouTube" && (
            <HeaderSettingsDialogYouTube
              isYoutubeConnected={isYoutubeConnected}
              handleDialogClose={handleDialogClose}
              playlistCount={youtubePlaylistCount}
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
  const { minePlaylist } = useYoutubeApiContext();
  const [isSpotifyConnected, setIsSpotifyConnected] = React.useState<boolean>(false);
  const [isYoutubeConnected, setIsYoutubeConnected] = React.useState<boolean>(false);
  const [isDeezerConnected, setIsDeezerConnected] = React.useState<boolean>(false);
  const [deezerPlaylistCount, setDeezerPlaylistCount] = React.useState<number>(0);
  const [spotifyPlaylistCount, setSpotifyPlaylistCount] = React.useState<number>();
  const [youtubePlaylistCount, setYoutubePlaylistCount] = React.useState<number>(0);
  const [value, setValue] = React.useState<BottomNavigationValues>("Spotify");
  const classes = useHeaderSettingsStyles();
  const { deezerToken, logout: dzLogout } = useDeezerAuth();
  const { youtubeToken, logout: ytLogout, googleAuthObject } = useYoutubeAuth();
  const { spotifyToken, logout: spLogout } = useSpotifyAuth();
  const { setLoading } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const { spotifyApi } = props;

  React.useEffect(() => {
    if (deezerToken) {
      DZ.api(`user/me/playlists?access_token=${deezerToken}`, (response) => {
        setDeezerPlaylistCount(response.total);
      });
    }
  }, [location.pathname, deezerToken]);

  React.useEffect(() => {
    if (spotifyToken) {
      spotifyApi.getUserPlaylists().then((response) => {
        setSpotifyPlaylistCount(response.body.total);
      });
    }
  }, [location.pathname, spotifyToken]);

  React.useEffect(() => {
    if (youtubeToken) {
      if (minePlaylist) {
        setIsYoutubeConnected(true);
        const { pageInfo } = minePlaylist.result;
        if (pageInfo && pageInfo.totalResults) {
          setYoutubePlaylistCount(pageInfo.totalResults);
        }
      } else if (!gapi || !gapi.client || !gapi.client.youtube || !gapi.client.youtube.playlists) {
        setTimeout(() => {
          if (!gapi || !gapi.client || !gapi.client.youtube || !gapi.client.youtube.playlists) {
            setTimeout(() => {
              gapi.client.youtube.playlists
                .list({
                  part: "snippet",
                  mine: true,
                  access_token: youtubeToken
                })
                .then((response) => {
                  const { pageInfo } = response.result;
                  setIsYoutubeConnected(true);
                  if (pageInfo && pageInfo.totalResults) {
                    setYoutubePlaylistCount(pageInfo.totalResults);
                  }
                });
            }, 1000);
          } else {
            gapi.client.youtube.playlists
              .list({
                part: "snippet",
                mine: true,
                access_token: youtubeToken
              })
              .then((response) => {
                const { pageInfo } = response.result;
                setIsYoutubeConnected(true);
                if (pageInfo && pageInfo.totalResults) {
                  setYoutubePlaylistCount(pageInfo.totalResults);
                }
              });
          }
        }, 1000);
      } else if (gapi && gapi.client && gapi.client.youtube && gapi.client.youtube.playlists) {
        gapi.client.youtube.playlists
          .list({
            part: "snippet",
            mine: true,
            access_token: youtubeToken
          })
          .then((response) => {
            setIsYoutubeConnected(true);
            const { pageInfo } = response.result;
            if (pageInfo && pageInfo.totalResults) {
              setYoutubePlaylistCount(pageInfo.totalResults);
            }
          });
      }
    }
  }, [youtubeToken]);

  React.useEffect(() => {
    if (spotifyToken) {
      try {
        spotifyApi.getMe().then((me) => {
          if (me.statusCode === 200) {
            setIsSpotifyConnected(true);
          }
        });
      } catch {
        setIsSpotifyConnected(false);
        spLogout();
      }
    }
  }, [spotifyToken]);

  React.useEffect(() => {
    if (deezerToken) {
      setIsDeezerConnected(true);
    }
  }, [deezerToken]);

  return (
    <SettingsDialogClass
      value={value}
      setValue={setValue}
      dzLogout={dzLogout}
      ytLogout={ytLogout}
      spLogout={spLogout}
      setIsSpotifyConnected={setIsSpotifyConnected}
      setIsYoutubeConnected={setIsYoutubeConnected}
      setIsDeezerConnected={setIsDeezerConnected}
      googleAuthObject={googleAuthObject}
      isDeezerConnected={isDeezerConnected}
      isYoutubeConnected={isYoutubeConnected}
      isSpotifyConnected={isSpotifyConnected}
      deezerPlaylistCount={deezerPlaylistCount}
      youtubePlaylistCount={youtubePlaylistCount}
      spotifyPlaylistCount={spotifyPlaylistCount}
      setLoading={setLoading}
      navigate={navigate}
      classes={classes}
      {...props}
    />
  );
});
