import { createStyles, makeStyles } from "@mui/styles";

export const ExploreStyles = () =>
  createStyles({
    exploreGrid: {
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
    },
    genreName: {
      padding: 0,
      color: "transparent",
      textTransform: "none",
      justifyContent: "start",
      "&:hover": {
        textDecoration: "solid underline rgba(255, 255, 255, .7) 1px"
      }
    }
  });

export const useExploreStyles = makeStyles(ExploreStyles);
