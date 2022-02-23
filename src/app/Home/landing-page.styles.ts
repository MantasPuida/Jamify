import { createStyles, makeStyles } from "@mui/styles";

export const HomeLandingPageStyles = () =>
  createStyles({
    homeGrid: {
      backgroundColor: "black"
    }
  });

export const useHomeLandingPageStyles = makeStyles(HomeLandingPageStyles);
