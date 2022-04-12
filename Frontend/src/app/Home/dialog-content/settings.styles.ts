import { createStyles, makeStyles } from "@mui/styles";
import { AppTheme } from "../../../shared/app-theme";

export const SettingsStyles = (theme: AppTheme) =>
  createStyles({
    button: {
      color: "black",
      width: "230px",
      flex: "1 1 auto",
      padding: "17px",
      textAlign: "center",
      transition: "0.5s",
      backgroundSize: "200% auto",
      boxShadow: "0 0 30px #8fd3f4",
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
      marginTop: "13%",
      textAlign: "center"
    },

    profilePicture: {
      maxWidth: 160,
      width: "100%",
      borderRadius: 5,
      [theme.breakpoints.down("sm")]: {
        maxWidth: 80
      }
    },
    contentStyles: {
      maxWidth: "32%",
      [theme.breakpoints.down("sm")]: {
        maxWidth: "16%"
      }
    },

    typographyStyles: {
      maxHeight: "24px",
      minWidth: 300,
      paddingLeft: 16,
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 0,
        paddingTop: 2
      }
    }
  });

export const useSettingsStyles = makeStyles(SettingsStyles);
