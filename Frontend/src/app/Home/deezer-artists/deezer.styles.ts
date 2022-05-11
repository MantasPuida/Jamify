import { createStyles, makeStyles } from "@mui/styles";
import { AppTheme } from "../../../shared/app-theme";

export const DeezerStyles = (theme: AppTheme) =>
  createStyles({
    deezerGrid: {
      backgroundColor: "black",
      padding: "64px 0 24px 0",
      margin: "0 150px",
      [theme.breakpoints.down("md")]: {
        margin: "0 50px"
      },
      [theme.breakpoints.down(400)]: {
        margin: "0 25px"
      }
    },
    artistText: {
      padding: 0,
      backgroundColor: "transparent",
      textTransform: "none",
      "&:hover": {
        textDecoration: "solid underline white 2px"
      }
    },

    image: {
      borderRadius: "50%",
      minHeight: 100,
      minWidth: 100,
      maxWidth: 250,
      [theme.breakpoints.down("md")]: {
        maxWidth: 120
      },
      [theme.breakpoints.down(500)]: {
        maxWidth: 100
      }
    },

    artistTitle: {
      fontSize: 45,
      fontWeight: 900,
      [theme.breakpoints.down("md")]: {
        fontSize: 35,
        fontWeight: 700,
        maxWidth: "85%"
      }
    },

    artistHelperTitle: {
      fontSize: 25,
      fontWeight: 400,
      paddingBottom: 16,
      [theme.breakpoints.down("md")]: {
        fontSize: 20,
        fontWeight: 400,
        maxWidth: "80%"
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

    dzCarouselItemText: {
      marginLeft: 10
    },
    dzFeaturedText: {
      textTransform: "none",
      padding: "0px",
      "&:hover": {
        textDecoration: "solid underline white 2px"
      }
    },
    dzImage: {
      borderRadius: "1%",
      minHeight: 278.8,
      minWidth: 278.8
    },

    tracksHelperTypography: {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      width: "100%",
      WebkitLineClamp: 3,
      maxWidth: 240,
      display: "block",
      color: "rgba(255, 255, 255, .7)"
    },
    tracksButtonOnHover: {
      "&:hover": {
        textDecoration: "solid underline rgba(255, 255, 255, .7) 1px"
      }
    },

    tracksCarouselImage: {
      borderRadius: "5%",
      maxWidth: "140px",
      maxHeight: "80px"
    },

    tracksTypography: {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      width: "100%",
      WebkitLineClamp: 3,
      display: "block",
      maxWidth: 240
    }
  });

export const useDeezerStyles = makeStyles(DeezerStyles);
