import { createStyles, makeStyles } from "@mui/styles";
import { AppTheme } from "../../shared/app-theme";

export const ArtistStyles = (theme: AppTheme) =>
  createStyles({
    artistGrid: {
      backgroundColor: "black",
      padding: "64px 0 24px 0",
      margin: "0 150px",
      display: "block"
    },
    artistImage: {
      maxWidth: "40%",
      float: "left",
      borderRadius: "50%"
    },
    artistGridText: {
      paddingLeft: theme.spacing(5),
      paddingTop: theme.spacing(4),
      flexFlow: "column",
      justifyContent: "center"
    },
    artistPaperStyles: {
      width: "100%",
      overflow: "hidden",
      backgroundColor: "black",
      paddingTop: 16
    },

    playlistsGrid: {
      backgroundColor: "black",
      padding: "64px 0 24px 0",
      margin: "0 150px",
      display: "block"
    },
    playlistImage: {
      maxWidth: "50%",
      float: "left",
      borderRadius: "1%"
    },
    playlistGridText: {
      paddingLeft: theme.spacing(5),
      flexFlow: "column",
      justifyContent: "center"
    },
    optionalGridText: {
      marginTop: theme.spacing(5)
    },
    buttonTextHover: {
      padding: 0,
      color: "transparent",
      textTransform: "none",
      justifyContent: "left",
      "&:hover": {
        textDecoration: "solid underline rgba(255, 255, 255, .7) 1px"
      }
    },
    buttonText: {
      justifyContent: "left",
      textAlign: "left",
      color: "transparent",
      padding: 0,
      textTransform: "none",
      width: "85%"
    },
    hover: {
      "&:hover img#rowTrackImage": {
        opacity: 0.5
      },

      "&:hover #playSvgIcon": {
        display: "block !important"
      },

      "&:hover #DotsSvgIcon": {
        display: "block !important"
      },

      "& td": {
        border: "0",
        borderBottom: "1px solid rgba(255,255,255,0.1)"
      }
    },
    playlistPaperStyles: {
      width: "100%",
      overflow: "hidden",
      backgroundColor: "black"
    },
    playlistFirstTableCell: {
      paddingLeft: 0
    },
    playlistLastTableCell: {
      paddingRight: 0
    },
    headerTypography: {
      fontFamily: "Poppins, sans-serif",
      fontSize: 24,
      fontWeight: 500,
      color: "white"
    },
    playlistImageStyle: {
      float: "left",
      borderRadius: "5%"
    },
    playlistIconButton: {
      position: "absolute",
      color: "white",
      width: 28,
      height: 28
    },
    playlistIconButtonIcon: {
      color: "white",
      display: "none"
    },
    artistTableCell: {
      maxWidth: 500,
      minWidth: 350,
      textAlignLast: "end"
    },
    artistTypography: {
      color: "rgba(255, 255, 255, .7)",
      textAlign: "right",
      float: "right",
      paddingLeft: 16
    },
    artistTypographyIcon: {
      color: "rgba(255, 255, 255, .7)",
      textAlign: "left",
      float: "left"
    },
    typography: {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      maxWidth: "225px",
      WebkitLineClamp: 3,
      display: "block",
      "&:hover": {
        textDecoration: "solid underline rgba(255, 255, 255, .7) 1px"
      }
    }
  });

export const useArtistStyles = makeStyles(ArtistStyles);
