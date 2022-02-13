/* eslint-disable react/button-has-type */
import * as React from "react";
import { Button, ButtonProps, Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import Typewriter from "typewriter-effect";
import { DashboardStyles, useDashboardStyles } from "./dashboard-styles";
import dashboardImage from "../../assets/dashboard/Dashboard_Image.png";
// import youtubeIcon from "../../assets/dashboard/Youtube_Icon.png";

import "./fontFamily.css";

interface OuterProps {
  spotifyLogin: ButtonProps["onClick"];
  youtubeLogin: ButtonProps["onClick"];
  deezerLogin: ButtonProps["onClick"];
}

type InnerProps = WithStyles<typeof DashboardStyles>;
type Props = InnerProps & OuterProps;

class LandingPageClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <Grid container={true} className={classes.mainWindow}>
        <Grid item={true} xs={4} className={classes.grid}>
          <Grid container={true} className={classes.leftSide}>
            <Grid item={true} className={classes.boxGrid}>
              <div className={classes.box} />
            </Grid>
            <Grid item={true} className={classes.textGrid}>
              <Typography fontFamily="Poppins, sans-serif" fontSize={100} className={classes.mainText} color="white">
                Get ready for your music
              </Typography>
            </Grid>
            <Grid item={true} className={classes.contentText}>
              <Typography
                fontFamily="sans-serif"
                fontSize={50}
                className={classes.mainText}
                color="white"
                component="div"
              >
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
              <Button variant="outlined">Login with Spotify</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item={true} xs={8} className={classes.image}>
          <img src={dashboardImage} alt="illustration" className={classes.imageTag} />
        </Grid>
      </Grid>
    );
  }
}

export const LandingPage = React.memo<OuterProps>((props) => {
  const classes = useDashboardStyles();

  return <LandingPageClass {...props} classes={classes} />;
});
