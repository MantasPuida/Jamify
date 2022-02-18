import { createStyles, makeStyles } from "@mui/styles";

export const HeaderStyles = () =>
  createStyles({
    mainContainer: {
      height: "80px",
      backgroundColor: "black"
    },
    leftHeaderItem: {
      alignSelf: "center",
      paddingLeft: 16
    },
    textSpacing: {
      marginLeft: 40,
      marginRight: 40
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
      paddingRight: 16
    },
    centerContent: {
      justifyContent: "center",
      alignContent: "center"
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
