import { createStyles, makeStyles } from "@mui/styles";

export const YoutubeTracksStyles = () =>
  createStyles({
    youtubeTracksGrid: {
      backgroundColor: "black",
      padding: "32px 0 24px 0",
      margin: "0 150px"
    }
  });

export const useYoutubeTracksStyles = makeStyles(YoutubeTracksStyles);
