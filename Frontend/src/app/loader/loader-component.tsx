import * as React from "react";
import "./loader.css";

export class Loader extends React.PureComponent {
  public render(): React.ReactNode {
    return (
      <div className="main">
        <div className="loader" />
      </div>
    );
  }
}
