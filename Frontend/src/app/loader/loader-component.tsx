import * as React from "react";
import { CircularProgress, Grid } from "@mui/material";

export class Loader extends React.PureComponent {
  public render(): React.ReactNode {
    return (
      <Grid
        container={true}
        item={true}
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "black",
          justifyContent: "center",
          alignContent: "center"
        }}>
        <CircularProgress style={{ color: "white" }} size={64} thickness={3} />;
      </Grid>
    );
  }
}
