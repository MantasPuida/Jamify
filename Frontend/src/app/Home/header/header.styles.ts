import { createStyles, makeStyles } from "@mui/styles";
import { AppTheme } from "../../../shared/app-theme";

export const HeaderStyles = (theme: AppTheme) =>
  createStyles({
    mainContainer: {
      backgroundColor: "black"
    },
    leftHeaderItem: {
      alignSelf: "center",
      paddingLeft: 16,
      [theme.breakpoints.down(400)]: {
        alignSelf: "normal"
      }
    },
    textSpacing: {
      marginLeft: 40,
      marginRight: 40,
      [theme.breakpoints.down("lg")]: {
        marginLeft: 20,
        marginRight: 20
      },
      [theme.breakpoints.down("sm")]: {
        marginLeft: 10,
        marginRight: 10
      }
    },
    buttons: {
      textTransform: "none",
      color: "grey",
      "&:hover": {
        color: "white !important"
      }
    },
    iconInText: {
      "& > *:first-child": {
        fontSize: 28
      }
    },
    textColor: {
      color: "white"
    },
    rightHeaderItem: {
      alignSelf: "center",
      textAlign: "end",
      paddingRight: 16,
      [theme.breakpoints.down(400)]: {
        alignSelf: "normal",
        marginLeft: -16
      }
    },
    centerContent: {
      justifyContent: "center",
      alignContent: "center",
      [theme.breakpoints.down(400)]: {
        flexDirection: "column",
        textAlign: "center"
      }
    },
    mainIcon: {
      width: 56,
      height: 56
    },
    iconButton: {
      color: "white"
    },
    headerMenuIcon: {
      width: 48,
      height: 48
    },
    headerMenuIconButton: {
      color: "white"
    },
    listItemIcon: {
      color: "black",
      width: 25,
      height: 25
    }
  });

export const useHeaderStyles = makeStyles(HeaderStyles);
