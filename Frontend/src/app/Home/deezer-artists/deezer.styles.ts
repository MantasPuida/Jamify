import { createStyles, makeStyles } from "@mui/styles";
import { AppTheme } from "../../../shared/app-theme";

export const DeezerStyles = (theme: AppTheme) =>
  createStyles({
    deezerGrid: {
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
      maxWidth: 160,
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
      [theme.breakpoints.down("md")]: {
        fontSize: 20,
        fontWeight: 400,
        maxWidth: "80%"
      }
    }
  });

export const useDeezerStyles = makeStyles(DeezerStyles);
