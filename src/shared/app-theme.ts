// eslint-disable-next-line no-restricted-imports
import { createTheme, Theme } from "@mui/material";

class ThemeClass {
  public static defaultTheme: Theme = createTheme({});
}

export type AppTheme = Theme & ThemeClass;

export const AppThemeInstance: AppTheme = {
  ...new ThemeClass(),
  ...ThemeClass.defaultTheme
};
