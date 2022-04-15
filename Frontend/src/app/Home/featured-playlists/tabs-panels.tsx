import * as React from "react";
import { Typography } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export class TabPanel extends React.PureComponent<TabPanelProps> {
  public render(): React.ReactNode {
    const { children, value, index, ...other } = this.props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}>
        {value === index && <Typography>{children}</Typography>}
      </div>
    );
  }
}
