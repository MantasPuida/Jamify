import { createStyles, makeStyles } from "@mui/styles";
import { AppTheme } from "../../../shared/app-theme";

export const FeaturedPlaylistsStyles = (theme: AppTheme) =>
  createStyles({
    featuredPlaylistsGrid: {
      backgroundColor: "black",
      padding: "32px 0 24px 0",
      margin: "0 150px",
      [theme.breakpoints.down("md")]: {
        margin: "0 50px"
      },
      [theme.breakpoints.down(400)]: {
        margin: "0 25px"
      }
    },
    ftPlGridItem: {
      borderBottom: 1,
      borderColor: "divider",
      backgroundColor: "black",
      padding: "32px 0 0 0",
      margin: "0 175px",
      [theme.breakpoints.down("md")]: {
        margin: "0 50px"
      },
      [theme.breakpoints.down(400)]: {
        margin: "0 25px"
      }
    },
    carousel: {
      marginLeft: -5,
      width: "81%",
      paddingTop: 8
    },
    image: {
      borderRadius: "1%",
      minHeight: 250,
      minWidth: 250
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

    featuredPlaylistsTitle: {
      fontSize: 45,
      fontWeight: 900,
      [theme.breakpoints.down("md")]: {
        fontSize: 35,
        fontWeight: 700
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

    typography: {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      width: "100%",
      WebkitLineClamp: 3,
      maxWidth: 240,
      display: "block"
    },
    helperTypography: {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      width: "100%",
      WebkitLineClamp: 3,
      maxWidth: 240,
      display: "block",
      color: "rgba(255, 255, 255, .7)"
    },
    buttonOnHover: {
      "&:hover": {
        textDecoration: "solid underline rgba(255, 255, 255, .7) 1px"
      }
    },

    carouselImage: {
      borderRadius: "5%",
      maxWidth: "96px"
    },

    artistText: {
      padding: 0,
      backgroundColor: "transparent",
      textTransform: "none",
      "&:hover": {
        textDecoration: "solid underline white 2px"
      }
    },

    artistImage: {
      borderRadius: "50%",
      minHeight: 100,
      minWidth: 100,
      maxHeight: 160,
      maxWidth: 160,
      [theme.breakpoints.down("md")]: {
        maxWidth: 120
      },
      [theme.breakpoints.down(500)]: {
        maxWidth: 100
      }
    },

    slideNext: {
      backgroundImage: "url(../../../assets/svg/chevron-right.svg)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "100% auto",
      backgroundPosition: "center",
      backgroundColor: "white",
      borderRadius: "50%",
      width: "40px",
      transform: "translateY(-65%) !important",
      height: "40px",
      position: "absolute",
      right: "20px"
    }
  });

export const useFeaturedPlaylistsStyles = makeStyles(FeaturedPlaylistsStyles);
