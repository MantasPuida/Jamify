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
    carousel: {
      marginLeft: -5,
      width: "81%",
      paddingTop: 8
    },
    image: {
      borderRadius: "1%",
      minHeight: 100,
      minWidth: 100
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
    }
  });

export const useFeaturedPlaylistsStyles = makeStyles(FeaturedPlaylistsStyles);
