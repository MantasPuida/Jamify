import { createStyles, makeStyles } from "@mui/styles";
import { AppTheme } from "../../shared/app-theme";

export const YoutubeTracksStyles = (theme: AppTheme) =>
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
      display: "block",
      maxWidth: 240
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
    },
    tabRootStyles: {
      marginBottom: -62,
      padding: 0,
      color: "transparent !important",
      backgroundColor: "transparent !important",
      fontSiz: 25,
      fontWeight: 400,
      fontFamily: "Poppins,sans-serif"
    },

    ytCarouselItemText: {
      marginLeft: 10
    },
    ytFeaturedText: {
      textTransform: "none",
      padding: "0px",
      "&:hover": {
        textDecoration: "solid underline white 2px"
      }
    },

    ytImage: {
      borderRadius: "1%",
      minHeight: 250,
      minWidth: 250
    },

    ytArtistText: {
      padding: 0,
      backgroundColor: "transparent",
      textTransform: "none",
      "&:hover": {
        textDecoration: "solid underline white 2px"
      }
    },

    ytArtistImage: {
      borderRadius: "50%",
      minHeight: 100,
      minWidth: 100,
      maxWidth: 160,
      [theme.breakpoints.down("md")]: {
        maxWidth: 120
      },
      [theme.breakpoints.down(500)]: {
        maxWidth: 100
      }
    }
  });

export const useYoutubeTracksStyles = makeStyles(YoutubeTracksStyles);
