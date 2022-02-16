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
    IconInText: {
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
    }
  });

export const useHeaderStyles = makeStyles(HeaderStyles);
