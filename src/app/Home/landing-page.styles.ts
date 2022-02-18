import { createStyles, makeStyles } from "@mui/styles";

export const HomeLandingPageStyles = () =>
  createStyles({
    scrollbars: {
      width: "100vw",
      height: "100vh"
    },
    homeGrid: {
      backgroundColor: "white"
    }
  });

export const useHomeLandingPageStyles = makeStyles(HomeLandingPageStyles);
