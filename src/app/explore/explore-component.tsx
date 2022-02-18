import { Grid } from "@mui/material";
import { WithStyles } from "@mui/styles";
import * as React from "react";
import { HeaderComponent } from "../Home/header/header-component";
import { HomeLandingPageStyles, useHomeLandingPageStyles } from "../Home/landing-page.styles";

type InnerProps = WithStyles<typeof HomeLandingPageStyles>;

class ExploreClass extends React.PureComponent<InnerProps> {
  public render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <Grid container={true} item={true} xs={12} className={classes.homeGrid}>
        <HeaderComponent />
      </Grid>
    );
  }
}

export const Explore = React.memo(() => {
  const classes = useHomeLandingPageStyles();

  return <ExploreClass classes={classes} />;
});
