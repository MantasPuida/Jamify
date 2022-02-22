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
      marginLeft: 50,
      marginTop: 10,
      width: 381
    },
    descriptiveTest: {
      marginLeft: 50,
      marginTop: 10
    },
    textGrid: {
      zIndex: 2
    },
    leftSide: {
      marginTop: 60
    },
    boxGrid: {
      zIndex: 1,
      position: "absolute"
    },
    typewriter: {
      float: "right",
      paddingLeft: 16,
      fontFamily: "Poppins, sans-serif"
    },
    contentText: {
      paddingTop: 80
    },
    box: {
      width: "100px",
      height: "200px",
      backgroundImage: "linear-gradient(270deg, #11998e, #38ef7d)"
    },
    button: {
      color: "black",
      width: "245px",
      flex: "1 1 auto",
      padding: "20px",
      textAlign: "center",
      transition: "0.5s",
      backgroundSize: "200% auto",
      boxShadow: "0 0 20px #113a99",
      textTransform: "none",
      borderRadius: "20px",
      justifyContent: "end",
      border: 0,
      backgroundImage: "linear-gradient(to right, #84fab0 0%, #8fd3f4 51%, #84fab0 100%)",

      "&:hover": {
        backgroundPosition: "right center",
        border: 0
      }
    },
    avatar: {
      justifyContent: "end"
    },
    loginButton: {
      paddingTop: 24
    }
  });

export const useDashboardStyles = makeStyles(DashboardStyles);
