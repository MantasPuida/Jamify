import { createStyles, makeStyles } from "@mui/styles";

export const SpotifyPlaylistsStyles = () =>
  createStyles({
    featuredPlaylistsGrid: {
      backgroundColor: "black",
      padding: "32px 0 24px 0",
      margin: "0 150px"
    },
    carousel: {
      marginLeft: -5,
      width: "81%",
      paddingTop: 8
    },
    image: {
      borderRadius: "1%",
      maxWidth: "160px",
      maxHeight: "160px",
      aspectRatio: "1/1",
      objectFit: "scale-down",
      border: "1px solid #101010",
      height: "100%"
    },
    carouselItemText: {
      marginRight: 10
    },
    featuredText: {
      textTransform: "none",
      color: "transparent",
      padding: 0,
      "&:hover": {
        textDecoration: "solid underline white 2px"
      }
    }
  });

export const useSpotifyPlaylistsStyles = makeStyles(SpotifyPlaylistsStyles);
