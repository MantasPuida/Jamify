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
import Spotify from "mdi-material-ui/Spotify";
import PlayCircleOutline from "mdi-material-ui/PlayCircleOutline";
import SpotifyWebApi from "spotify-web-api-node";
import { WithStyles } from "@mui/styles";
import { useDeezerAuth } from "../../../context/deezer-context";
import { useYoutubeAuth } from "../../../context/youtube-context";
import { useSpotifyAuth } from "../../../context/spotify-context";
import { HeaderSettingsDialogSpotify } from "../dialogs/header-settings-dialog-spotify";
import { HeaderSettingsDialogYouTube } from "../dialogs/header-settings-dialog-youtube";
import { HeaderSettingsDialogDeezer } from "../dialogs/header-settings-dialog-deezer";
import { HeaderSettingsStyles, useHeaderSettingsStyles } from "./header-settings.styles";

import "./fontFamily.css";
import { DeezerIcon } from "./deezer-icon-svg";

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
      spotifyApi
    } = this.props;

    return (
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography fontFamily="Poppins,sans-serif" style={{ color: "black" }} fontSize={24}>
            {value} Settings
          </Typography>
        </DialogTitle>
        <DialogContent style={{ minWidth: 500, minHeight: 200 }}>
          {(value as BottomNavigationValues) === "Spotify" && (
            <HeaderSettingsDialogSpotify
              isSpotifyConnected={isSpotifyConnected}
              handleDialogClose={handleDialogClose}
              spotifyApi={spotifyApi}
            />
          )}
          {(value as BottomNavigationValues) === "YouTube" && (
            <HeaderSettingsDialogYouTube
              isYoutubeConnected={isYoutubeConnected}
              handleDialogClose={handleDialogClose}
            />
          )}
          {(value as BottomNavigationValues) === "Deezer" && (
            <HeaderSettingsDialogDeezer isDeezerConnected={isDeezerConnected} handleDialogClose={handleDialogClose} />
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
  const [value, setValue] = React.useState<BottomNavigationValues>("Spotify");
  const classes = useHeaderSettingsStyles();
  const { deezerToken } = useDeezerAuth();
  const { youtubeToken } = useYoutubeAuth();
  const { spotifyToken } = useSpotifyAuth();

  let isYoutubeConnected: boolean = false;
  let isDeezerConnected: boolean = false;
  let isSpotifyConnected: boolean = false;

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
      classes={classes}
      {...props}
    />
  );
});
