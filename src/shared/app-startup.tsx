import * as React from "react";
import { ToastContainer } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { AppTheme, AppThemeInstance } from "./app-theme";
import Jamify from "../app/Jamify";

export class AppStartup extends React.PureComponent {
  constructor(props: object) {
    super(props);

    injectStyle();
  }

  public render(): React.ReactNode {
    return (
      <ThemeProvider<AppTheme> theme={AppThemeInstance}>
        <StyledEngineProvider injectFirst={true}>
          <BrowserRouter>
            <Jamify />
            <ToastContainer limit={3} />
          </BrowserRouter>
        </StyledEngineProvider>
      </ThemeProvider>
    );
  }
}
