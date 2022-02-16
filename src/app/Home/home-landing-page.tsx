import { Grid } from "@mui/material";
import * as React from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { Scrollbars } from "react-custom-scrollbars-2";
import { HeaderComponent } from "./header/header-component";
// import YTMusic from "ytmusic-api";

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

class HomeLandingPageClass extends React.PureComponent<OuterProps> {
  public render(): React.ReactNode {
    return (
      <Scrollbars
        style={{ width: "100vw", height: "100vh" }}
        autoHideTimeout={1000}
        autoHide={true}
        autoHideDuration={200}
      >
        <Grid
          container={true}
          item={true}
          xs={12}
          style={{ backgroundColor: "white", width: "100vw", height: "100vw" }}
        >
          <HeaderComponent />
        </Grid>
      </Scrollbars>
    );
  }
}

export const HomeLandingPage = React.memo<OuterProps>((props) => <HomeLandingPageClass {...props} />);
