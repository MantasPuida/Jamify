import * as React from "react";
import clsx from "clsx";
import Magnify from "mdi-material-ui/Magnify";
import MusicAccidentalDoubleFlat from "mdi-material-ui/MusicAccidentalDoubleFlat";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { useLocation, Location } from "react-router";
import { HeaderStyles, useHeaderStyles } from "./header.styles";
import { AppRoutes } from "../../routes/routes";

import "./fontFamily.css";
import { AccountMenu } from "./header-account-menu";

interface InnerProps extends WithStyles<typeof HeaderStyles> {
  location: Location;
}

class HeaderComponentClass extends React.PureComponent<InnerProps> {
  public render(): React.ReactNode {
    const { classes, location } = this.props;
    const { pathname } = location;

    return (
      <Grid container={true} item={true} xs={12} className={classes.mainContainer}>
        <Grid item={true} xs={2} color="white" className={classes.leftHeaderItem}>
          <IconButton style={{ color: "white" }}>
            <MusicAccidentalDoubleFlat style={{ width: 56, height: 56 }} />
          </IconButton>
        </Grid>
        <Grid item={true} container={true} xs={8} color="white" className={classes.centerContent}>
          <Grid item={true} className={classes.textSpacing}>
            <Button
              variant="text"
              className={clsx({ [classes.textColor]: pathname === AppRoutes.Home }, classes.buttons)}
            >
              <Typography fontSize={28} fontFamily="Poppins,sans-serif">
                Home
              </Typography>
            </Button>
          </Grid>
          <Grid item={true} className={classes.textSpacing}>
            <Button
              variant="text"
              className={clsx({ [classes.textColor]: pathname === AppRoutes.Explore }, classes.buttons)}
            >
              <Typography fontSize={28} fontFamily="Poppins,sans-serif">
                Explore
              </Typography>
            </Button>
          </Grid>
          <Grid item={true} className={classes.textSpacing}>
            <Button
              variant="text"
              className={clsx({ [classes.textColor]: pathname === AppRoutes.Search }, classes.buttons)}
              classes={{ iconSizeMedium: classes.IconInText }}
              startIcon={<Magnify />}
            >
              <Typography fontSize={28} fontFamily="Poppins,sans-serif">
                Search
              </Typography>
            </Button>
          </Grid>
        </Grid>
        <Grid item={true} xs={2} color="white" className={classes.rightHeaderItem}>
          <AccountMenu />
        </Grid>
      </Grid>
    );
  }
}

export const HeaderComponent = React.memo(() => {
  const location = useLocation();
  const classes = useHeaderStyles();

  return <HeaderComponentClass location={location} classes={classes} />;
});
