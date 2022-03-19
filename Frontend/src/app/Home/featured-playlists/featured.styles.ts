import { createStyles, makeStyles } from "@mui/styles";

export const FeaturedPlaylistsStyles = () =>
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
      maxWidth: "260px",
      height: "100%"
    },
    carouselItemText: {
      marginLeft: 10
    },
    featuredText: {
      textTransform: "none",
      padding: "0px",
      "&:hover": {
        textDecoration: "solid underline white 2px"
      }
    }
  });

export const useFeaturedPlaylistsStyles = makeStyles(FeaturedPlaylistsStyles);
