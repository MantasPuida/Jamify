import * as React from "react";
import { WithStyles } from "@mui/styles";
import { Grid } from "@mui/material";
import { HeaderComponent } from "../Home/header/header-component";
import { HomeLandingPageStyles, useHomeLandingPageStyles } from "../Home/landing-page.styles";

type InnerProps = WithStyles<typeof HomeLandingPageStyles>;

class SearchClass extends React.PureComponent<InnerProps> {
  public render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <Grid container={true} item={true} xs={12} className={classes.homeGrid}>
        <HeaderComponent />
      </Grid>
    );
  }
}

export const Search = React.memo(() => {
  const classes = useHomeLandingPageStyles();

  return <SearchClass classes={classes} />;
});
