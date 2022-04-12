import * as React from "react";
import {
  Avatar,
  Button,
  ButtonProps,
  CircularProgress,
  Grid,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useLocation, Location } from "react-router";
import SpotifyWebApi from "spotify-web-api-node";
import { WithStyles } from "@mui/styles";
import spotifyIcon from "../../../assets/dashboard/Spotify_Icon_Black.png";
import { SettingsStyles, useSettingsStyles } from "./settings.styles";
import { SpotifyConstants } from "../../../constants/constants-spotify";

import "./fontFamily.css";
import { AppTheme } from "../../../shared/app-theme";

interface OuterProps {
  isSpotifyConnected: boolean;
  spotifyApi: SpotifyWebApi;
  handleDialogClose: ButtonProps["onClick"];
  playlistCount: number;
}

interface InnerProps extends WithStyles<typeof SettingsStyles> {
  location: Location;
  isMobile: boolean;
}

interface State {
  loading: boolean;
  spotifyProfile?: SpotifyApi.CurrentUsersProfileResponse;
}

type Props = InnerProps & OuterProps;

class HeaderSettingsDialogSpotifyClass extends React.PureComponent<Props, State> {
  public state: State;

  constructor(props: Props) {
    super(props);

    const { isSpotifyConnected } = props;

    if (isSpotifyConnected) {
      this.state = { loading: true };
      this.fetchUserData(props.spotifyApi);
    } else {
      this.state = { loading: false };
    }
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
    const { isSpotifyConnected, classes, playlistCount, isMobile } = this.props;
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
            endIcon={<Avatar className={classes.avatar} src={spotifyIcon} />}>
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
      <Grid container={true} style={{ overflow: "hidden" }}>
        <Grid item={true} xs={4} className={classes.contentStyles}>
          <img src={images[0].url} alt="me" className={classes.profilePicture} />
        </Grid>
        <Grid container={true} item={true} xs={isMobile ? 12 : 8} style={{ flexDirection: "column" }}>
          <Grid item={true} xs={4} className={classes.typographyStyles}>
            <Typography fontFamily="Poppins,sans-serif">{displayName ?? "User"}</Typography>
          </Grid>
          <Grid item={true} xs={4} className={classes.typographyStyles}>
            <Typography fontFamily="Poppins,sans-serif">{email}</Typography>
          </Grid>
          <br />
          <br />
          <Grid item={true} xs={12} className={classes.typographyStyles}>
            <Typography fontFamily="Poppins,sans-serif">Playlists: {playlistCount}</Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const HeaderSettingsDialogSpotify = React.memo<OuterProps>((props) => {
  const classes = useSettingsStyles();
  const location = useLocation();

  const theme = useTheme<AppTheme>();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return <HeaderSettingsDialogSpotifyClass isMobile={isMobile} {...props} classes={classes} location={location} />;
});
