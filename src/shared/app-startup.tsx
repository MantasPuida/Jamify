import * as React from "react";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import { AppTheme, AppThemeInstance } from "./app-theme";
import { AppRoutes } from "../routes/app-routes";
import { Loader } from "../app/loader/loader-component";

interface State {
  loader: boolean;
}

export class AppStartup extends React.PureComponent<object, State> {
  constructor(props: any) {
    super(props);
    this.state = { loader: true };
  }

  public componentDidMount(): void {
    this.setState({ loader: false });
  }

  public render(): React.ReactNode {
    const { loader } = this.state;

    if (loader) {
      return <Loader />;
    }

    return (
      <ThemeProvider<AppTheme> theme={AppThemeInstance}>
        <StyledEngineProvider injectFirst={true}>
          <SnackbarProvider maxSnack={3}>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </SnackbarProvider>
        </StyledEngineProvider>
      </ThemeProvider>
    );
  }
}
