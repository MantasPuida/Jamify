import { createStyles, makeStyles } from "@mui/styles";

export const HomeLandingPageStyles = () =>
  createStyles({
    homeGrid: {
      backgroundColor: "black"
    },

    overflow: {
      overflowX: "hidden"
    }
  });

export const useHomeLandingPageStyles = makeStyles(HomeLandingPageStyles);
