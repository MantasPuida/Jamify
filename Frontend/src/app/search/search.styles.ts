import { createStyles, makeStyles } from "@mui/styles";
import { AppTheme } from "../../shared/app-theme";

export const SearchStyles = (theme: AppTheme) =>
  createStyles({
    homeGrid: {
      overflowX: "hidden",
      padding: "32px 0 24px 0",
      margin: "0 150px",
      [theme.breakpoints.down("sm")]: {
        margin: "0 50px"
      },
      [theme.breakpoints.down(400)]: {
        margin: "0 25px"
      }
    },

    contentGrid: {
      overflowX: "hidden",
      padding: "32px 0 24px 0"
    },

    textField: {
      maxWidth: "80%",
      color: "white",
      [theme.breakpoints.down("xl")]: {
        maxWidth: "calc(80% - 50px)"
      },
      [theme.breakpoints.down("lg")]: {
        maxWidth: "calc(80% - 80px)"
      },
      [theme.breakpoints.down("md")]: {
        maxWidth: "calc(80% - 100px)"
      },
      [theme.breakpoints.down("sm")]: {
        maxWidth: "calc(80%)"
      },
      [theme.breakpoints.down(400)]: {
        maxWidth: "calc(80% + 30px)"
      }
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
      textAlign: "center",
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
