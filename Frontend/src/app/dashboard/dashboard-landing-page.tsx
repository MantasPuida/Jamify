import * as React from "react";
import { Avatar, Button, ButtonProps, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { WithStyles } from "@mui/styles";
import Typewriter from "typewriter-effect";
import { DashboardStyles, useDashboardStyles } from "./dashboard-styles";
import dashboardImage from "../../assets/dashboard/Dashboard_Image.png";
import youtubeIcon from "../../assets/dashboard/Youtube_Icon_Black.png";
import deezerIcon from "../../assets/dashboard/Deezer_Icon_Black.png";
import spotifyIcon from "../../assets/dashboard/Spotify_Icon_Black.png";
import { AppTheme } from "../../shared/app-theme";

import "./fontFamily.css";

interface OuterProps {
  spotifyLogin: ButtonProps["onClick"];
  youtubeLogin: ButtonProps["onClick"];
  deezerLogin: ButtonProps["onClick"];
}

interface InnerProps extends WithStyles<typeof DashboardStyles> {
  isMobile: boolean;
}

type Props = InnerProps & OuterProps;

class DashboardLandingPageClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { classes, deezerLogin, spotifyLogin, youtubeLogin, isMobile } = this.props;

    return (
      <Grid container={true} className={classes.mainWindow}>
        <Grid item={true} xs={4} className={classes.grid}>
          <Grid container={true} className={classes.leftSide}>
            <Grid item={true} className={classes.boxGrid}>
              <div className={classes.box} />
            </Grid>
            <Grid item={true} className={classes.textGrid}>
              <Typography fontFamily="Poppins, sans-serif" className={classes.mainText} color="white">
                Get ready for your music
              </Typography>
            </Grid>
            <Grid item={true} className={classes.contentText}>
              <Typography fontFamily="sans-serif" className={classes.descriptiveText} color="white" component="div">
                Listen to
                <div className={classes.typewriter}>
                  <Typewriter
                    options={{
                      strings: ["Spotify.", "Deezer.", "Youtube."],
                      autoStart: true,
                      loop: true,
                      skipAddStyles: true
                    }}
                  />
                </div>
              </Typography>
            </Grid>
            <Grid item={true} container={true} style={{ marginLeft: 55, paddingTop: 75 }}>
              <Grid item={true} className={classes.loginButton} xs={12}>
                <Button
                  className={classes.button}
                  variant="outlined"
                  onClick={spotifyLogin}
                  endIcon={<Avatar className={classes.avatar} src={spotifyIcon} />}>
                  <Typography fontFamily="Poppins, sans-serif">Login via Spotify</Typography>
                </Button>
              </Grid>
              <Grid item={true} className={classes.loginButton} xs={12}>
                <Button
                  className={classes.button}
                  variant="outlined"
                  onClick={youtubeLogin}
                  endIcon={<Avatar className={classes.avatar} src={youtubeIcon} />}>
                  <Typography fontFamily="Poppins, sans-serif">Login via Youtube</Typography>
                </Button>
              </Grid>
              <Grid item={true} className={classes.loginButton} xs={12}>
                <Button
                  className={classes.button}
                  variant="outlined"
                  onClick={deezerLogin}
                  endIcon={<Avatar className={classes.avatar} src={deezerIcon} />}>
                  <Typography fontFamily="Poppins, sans-serif">Login via Deezer</Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {!isMobile && (
          <Grid container={true} item={true} xs={8} className={classes.image}>
            <img src={dashboardImage} alt="illustration" className={classes.imageTag} />
          </Grid>
        )}
      </Grid>
    );
  }
}

export const DashboardLandingPage = React.memo<OuterProps>((props) => {
  const classes = useDashboardStyles();
  const theme = useTheme<AppTheme>();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return <DashboardLandingPageClass isMobile={isMobile} {...props} classes={classes} />;
});
