import { createStyles, makeStyles } from "@mui/styles";

export const YoutubeTracksStyles = () =>
  createStyles({
    youtubeTracksGrid: {
      backgroundColor: "black",
      padding: "32px 0 24px 0",
      margin: "0 150px"
    },
    image: {
      borderRadius: "1%",
      maxWidth: "260px",
      height: "100%"
    }
  });

export const useYoutubeTracksStyles = makeStyles(YoutubeTracksStyles);
