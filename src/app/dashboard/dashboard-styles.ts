import { createStyles, makeStyles } from "@mui/styles";

export const DashboardStyles = () =>
  createStyles({
    mainWindow: {
      backgroundImage: "linear-gradient(315deg, #43C6AC, #191654)",
      width: "100vw",
      height: "100vh"
    },
    grid: {
      width: "100vw",
      height: "100vh"
    },
    image: {
      width: "100vw",
      height: "100vh",
      textAlignLast: "center"
    },
    imageTag: {
      height: "100%"
    },
    mainText: {
      marginLeft: "55px"
    },
    textGrid: {
      zIndex: 2
    },
    leftSide: {
      marginTop: 125
    },
    boxGrid: {
      zIndex: 1,
      position: "absolute"
    },
    typewriter: {
      float: "right",
      paddingLeft: 16
    },
    contentText: {
      paddingTop: 75
    },
    box: {
      width: "150px",
      height: "315px",
      backgroundImage: "linear-gradient(270deg, #11998e, #38ef7d)"
    }
  });

export const useDashboardStyles = makeStyles(DashboardStyles);
