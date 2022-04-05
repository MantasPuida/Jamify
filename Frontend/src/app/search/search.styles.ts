import { createStyles, makeStyles } from "@mui/styles";

export const SearchStyles = () =>
  createStyles({
    homeGrid: {
      overflowX: "hidden",
      padding: "32px 0 24px 0",
      margin: "0 150px"
    },

    contentGrid: {
      overflowX: "hidden",
      padding: "32px 0 24px 0"
    },

    textField: {
      maxWidth: "80%",
      color: "white"
    },

    typography: {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      maxWidth: 160,
      WebkitLineClamp: 3,
      fontFamily: "Poppins,sans-serif",
      fontSize: 16,
      display: "block",
      "&:hover": {
        textDecoration: "solid underline rgba(255, 255, 255, .7) 1px"
      }
    },

    typographyWithPadding: {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      paddingLeft: 16,
      overflow: "hidden",
      maxWidth: 160,
      WebkitLineClamp: 3,
      fontFamily: "Poppins,sans-serif",
      fontSize: 16,
      display: "block",
      "&:hover": {
        textDecoration: "solid underline rgba(255, 255, 255, .7) 1px"
      }
    }
  });

export const useSearchStyles = makeStyles(SearchStyles);
