import { createStyles, makeStyles } from "@mui/styles";
import { AppTheme } from "../../shared/app-theme";

export const PlaylistStyles = (theme: AppTheme) =>
  createStyles({
    playlistsGrid: {
      backgroundColor: "black",
      padding: "64px 0 24px 0",
      margin: "0 150px",
      display: "block"
    },
    playlistImage: {
      maxWidth: "50%",
      float: "left",
      borderRadius: "1%"
    },
    playlistGridText: {
      paddingLeft: theme.spacing(5),
      flexFlow: "column",
      justifyContent: "center",
      marginTop: theme.spacing(5)
    }
  });

export const usePlaylistStyles = makeStyles(PlaylistStyles);
