import * as React from "react";
import { CircularProgress, Backdrop } from "@mui/material";

export class BackdropLoader extends React.PureComponent {
  public render(): React.ReactNode {
    return (
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
        <CircularProgress style={{ color: "white" }} size={64} thickness={3} />
      </Backdrop>
    );
  }
}
