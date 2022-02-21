import { createStyles, makeStyles } from "@mui/styles";

export const PlaylistStyles = () =>
  createStyles({
    PlaylistsGrid: {
      backgroundColor: "black",
      padding: "64px 0 24px 0",
      margin: "0 150px",
      display: "block"
    }
  });

export const usePlaylistStyles = makeStyles(PlaylistStyles);
