import { createStyles, makeStyles } from "@mui/styles";

export const DeezerStyles = () =>
  createStyles({
    deezerGrid: {
      backgroundColor: "black",
      padding: "32px 0 24px 0",
      margin: "0 150px"
    },
    artistText: {
      padding: 0,
      backgroundColor: "transparent",
      textTransform: "none",
      "&:hover": {
        textDecoration: "solid underline white 2px"
      }
    }
  });

export const useDeezerStyles = makeStyles(DeezerStyles);
