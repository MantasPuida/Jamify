import { createStyles, makeStyles } from "@mui/styles";

export const YoutubeTracksStyles = () =>
  createStyles({
    youtubeTracksGrid: {
      backgroundColor: "black",
      padding: "32px 0 24px 0",
      margin: "0 150px"
    },
    image: {
      borderRadius: "5%",
      maxWidth: "96px"
    },
    typography: {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      width: "100%",
      WebkitLineClamp: 3,
      display: "block"
    },
    helperTypography: {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      width: "100%",
      WebkitLineClamp: 3,
      display: "block",
      color: "rgba(255, 255, 255, .7)"
    },
    buttonOnHover: {
      "&:hover": {
        textDecoration: "solid underline rgba(255, 255, 255, .7) 1px"
      }
    }
  });

export const useYoutubeTracksStyles = makeStyles(YoutubeTracksStyles);
