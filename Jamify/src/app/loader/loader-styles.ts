import { createStyles, makeStyles } from "@mui/styles";

export const LoaderStyles = () =>
  createStyles({
    background: {
      backgroundImage: "linear-gradient(315deg, #43C6AC, #191654)",
      width: "100vw",
      height: "100vh"
    }
  });

export const useLoaderStyles = makeStyles(LoaderStyles);
