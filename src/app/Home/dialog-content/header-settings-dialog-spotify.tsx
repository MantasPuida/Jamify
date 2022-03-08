import * as React from "react";
import { Avatar, Button, ButtonProps, CircularProgress, Grid, Typography } from "@mui/material";
import { useLocation, Location } from "react-router";
import SpotifyWebApi from "spotify-web-api-node";
import { WithStyles } from "@mui/styles";
import spotifyIcon from "../../../assets/dashboard/Spotify_Icon_Black.png";
import { SettingsStyles, useSettingsStyles } from "./settings.styles";
import { SpotifyConstants } from "../../../constants/constants-spotify";

import "./fontFamily.css";

interface OuterProps {
  isSpotifyConnected: boolean;
  spotifyApi: SpotifyWebApi;
  handleDialogClose: ButtonProps["onClick"];
}

interface InnerProps extends WithStyles<typeof SettingsStyles> {
  location: Location;
}

interface State {
  loading: boolean;
  spotifyProfile?: SpotifyApi.CurrentUsersProfileResponse;
}

type Props = InnerProps & OuterProps;

class HeaderSettingsDialogSpotifyClass extends React.PureComponent<Props, State> {
  public state: State = { loading: true };

  constructor(props: Props) {
    super(props);

    this.fetchUserData(props.spotifyApi);
  }

  private fetchUserData = (spotifyApi: SpotifyWebApi): void => {
    spotifyApi
      .getMe()
      .then((callback) => {
        this.setState({ spotifyProfile: callback.body, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        // eslint-disable-next-line no-console
        console.error(err);
      });
  };

  private spotifyLogin: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { handleDialogClose } = this.props;

    window.open(SpotifyConstants.SPOTIFY_AUTH_URL, "_self");

    if (handleDialogClose) {
      handleDialogClose(event);
    }
  };

  public render(): React.ReactNode {
    const { isSpotifyConnected, classes } = this.props;
    const { spotifyProfile, loading } = this.state;

    if (loading) {
      return <CircularProgress style={{ marginTop: "13%", marginLeft: "45%", color: "black" }} />;
    }

    if (!isSpotifyConnected || !spotifyProfile) {
      return (
        <Grid item={true} className={classes.loginButton} xs={12}>
          <Button
            className={classes.button}
            variant="outlined"
            onClick={this.spotifyLogin}
            endIcon={<Avatar className={classes.avatar} src={spotifyIcon} />}
          >
            <Typography fontFamily="Poppins, sans-serif">Login via Spotify</Typography>
          </Button>
        </Grid>
      );
    }

    const { images, display_name: displayName, email } = spotifyProfile;

    if (!images) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    return (
      <Grid container={true}>
        <Grid item={true} xs={4} style={{ maxWidth: "32%" }}>
          <img src={images[0].url} alt="me" style={{ maxWidth: 160, borderRadius: 5 }} />
        </Grid>
        <Grid container={true} item={true} xs={8} style={{ flexDirection: "column" }}>
          <Grid item={true} xs={4} style={{ maxHeight: "24px", minWidth: 300, paddingLeft: 16, paddingTop: 16 }}>
            <Typography fontFamily="Poppins,sans-serif">{displayName ?? "User"}</Typography>
          </Grid>
          <Grid item={true} xs={4} style={{ maxHeight: "24px", minWidth: 300, paddingLeft: 16, paddingTop: 16 }}>
            <Typography fontFamily="Poppins,sans-serif">{email}</Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const HeaderSettingsDialogSpotify = React.memo<OuterProps>((props) => {
  const classes = useSettingsStyles();
  const location = useLocation();

  return <HeaderSettingsDialogSpotifyClass {...props} classes={classes} location={location} />;
});
