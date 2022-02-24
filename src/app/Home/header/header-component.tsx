import * as React from "react";
import clsx from "clsx";
import Magnify from "mdi-material-ui/Magnify";
import MusicRestQuarter from "mdi-material-ui/MusicRestQuarter";
import SpotifyWebApi from "spotify-web-api-node";
import { Button, ButtonProps, Grid, IconButton, IconButtonProps, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { useLocation, Location, NavigateFunction, useNavigate } from "react-router";
import { HeaderStyles, useHeaderStyles } from "./header.styles";
import { AppRoutes } from "../../routes/routes";
import { AccountMenu } from "./header-account-menu";

import "./fontFamily.css";

interface InnerProps extends WithStyles<typeof HeaderStyles> {
  location: Location;
  navigate: NavigateFunction;
}

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

type Props = OuterProps & InnerProps;

class HeaderComponentClass extends React.PureComponent<Props> {
  private handleOnExploreClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate } = this.props;

    navigate(AppRoutes.Explore);
  };

  private handleOnSearchClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate } = this.props;

    navigate(AppRoutes.Search);
  };

  private handleOnHomeClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate } = this.props;

    navigate(AppRoutes.Home);
  };

  private handleOnIconClick: IconButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate } = this.props;

    navigate(AppRoutes.Home);
  };

  public render(): React.ReactNode {
    const { classes, location, spotifyApi } = this.props;
    const { pathname } = location;

    return (
      <Grid container={true} item={true} xs={12} className={classes.mainContainer}>
        <Grid item={true} xs={2} className={classes.leftHeaderItem}>
          <IconButton className={classes.iconButton} onClick={this.handleOnIconClick}>
            <MusicRestQuarter className={classes.mainIcon} />
          </IconButton>
        </Grid>
        <Grid item={true} container={true} xs={8} color="white" className={classes.centerContent}>
          <Grid item={true} className={classes.textSpacing}>
            <Button
              variant="text"
              className={clsx({ [classes.textColor]: pathname === AppRoutes.Home }, classes.buttons)}
              onClick={this.handleOnHomeClick}
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
              onClick={this.handleOnExploreClick}
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
              classes={{ iconSizeMedium: classes.iconInText }}
              onClick={this.handleOnSearchClick}
              startIcon={<Magnify />}
            >
              <Typography fontSize={28} fontFamily="Poppins,sans-serif">
                Search
              </Typography>
            </Button>
          </Grid>
        </Grid>
        <Grid item={true} xs={2} color="white" className={classes.rightHeaderItem}>
          <AccountMenu spotifyApi={spotifyApi} />
        </Grid>
      </Grid>
    );
  }
}

export const HeaderComponent = React.memo<OuterProps>((props) => {
  const classes = useHeaderStyles();
  const location = useLocation();
  const navigate = useNavigate();

  return <HeaderComponentClass location={location} {...props} navigate={navigate} classes={classes} />;
});
