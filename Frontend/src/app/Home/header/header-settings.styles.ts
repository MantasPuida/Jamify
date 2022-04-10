import { createStyles, makeStyles } from "@mui/styles";
import { AppTheme } from "../../../shared/app-theme";

export const HeaderSettingsStyles = (theme: AppTheme) =>
  createStyles({
    dialogContentStyles: {
      minWidth: 500,
      minHeight: 200,
      [theme.breakpoints.down("sm")]: {
        minWidth: 200,
        minHeight: 100
      }
    }
  });

export const useHeaderSettingsStyles = makeStyles(HeaderSettingsStyles);
