import { createStyles, makeStyles } from "@mui/styles";
import { AppTheme } from "../../shared/app-theme";

export const DashboardStyles = (theme: AppTheme) =>
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
      width: "100%",
      height: "100%",
      textAlignLast: "center",
      placeContent: "center"
    },
    imageTag: {
      height: "100%",
      marginLeft: 150,
      [theme.breakpoints.between("md", "xl")]: {
        height: "80%"
      }
    },
    mainText: {
      marginLeft: 45,
      marginTop: 10,
      width: "calc(100% - 175px)",
      fontSize: 56,
      fontWeight: 700,
      [theme.breakpoints.down("sm")]: {
        fontSize: 40,
        marginTop: 30,
        width: "calc(100% + 155px)"
      }
    },
    descriptiveText: {
      marginLeft: 50,
      marginTop: 10,
      fontSize: 48,
      [theme.breakpoints.down("sm")]: {
        fontSize: 32,
        marginLeft: 40,
        width: "calc(100% + 10px)"
      }
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
      fontFamily: "Poppins, sans-serif",
      fontWeight: 700,
      width: 0,
      [theme.breakpoints.down("sm")]: {
        fontSize: 32,
        paddingLeft: 8,
        maxWidth: 0
      }
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
