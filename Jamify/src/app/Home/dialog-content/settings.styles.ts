import { createStyles, makeStyles } from "@mui/styles";

export const SettingsStyles = () =>
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
    }
  });

export const useSettingsStyles = makeStyles(SettingsStyles);
