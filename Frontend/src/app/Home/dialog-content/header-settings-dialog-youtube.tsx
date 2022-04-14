import * as React from "react";
import { NavigateFunction, useNavigate } from "react-router";
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
import { WithStyles } from "@mui/styles";
import { useYoutubeAuth } from "../../../context/youtube-context";
import { SettingsStyles, useSettingsStyles } from "./settings.styles";
import youtubeIcon from "../../../assets/dashboard/Youtube_Icon_Black.png";
import { AppRoutes } from "../../routes/routes";
import { Notify } from "../../notification/notification-component";
import { AppTheme } from "../../../shared/app-theme";

import "./fontFamily.css";

interface OuterProps {
  isYoutubeConnected: boolean;
  handleDialogClose: ButtonProps["onClick"];
  playlistCount: number;
}

interface InnerProps extends WithStyles<typeof SettingsStyles> {
  googleAuthObject: gapi.auth2.GoogleAuthBase | undefined;
  register: Function;
  navigate: NavigateFunction;
  isMobile: boolean;
}

interface State {
  loading: boolean;
  googleUser?: gapi.auth2.BasicProfile;
  shareUrlId?: string;
}

type Props = InnerProps & OuterProps;

class HeaderSettingsDialogYouTubeClass extends React.PureComponent<Props, State> {
  public state: State = { loading: true };

  componentDidMount() {
    const { isYoutubeConnected, googleAuthObject } = this.props;

    if (isYoutubeConnected) {
      this.fetchUserData(googleAuthObject);
    }

    this.setState({ loading: false });
  }

  private fetchUserData = (googleAuthObject: gapi.auth2.GoogleAuthBase | undefined): void => {
    const googleUserObject = googleAuthObject?.currentUser.get().getBasicProfile();

    gapi.client.youtube.channels
      .list({
        part: "snippet",
        mine: true
      })
      .then((response) => {
        if (response.result.items && response.result.items[0].id) {
          this.setState({ googleUser: googleUserObject, shareUrlId: response.result.items[0].id });
        }
      });
  };

  private youtubeLogin: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { googleAuthObject, register, navigate, handleDialogClose } = this.props;

    googleAuthObject
      ?.signIn()
      .then((value: gapi.auth2.GoogleUser) => {
        const { access_token: AccessToken } = value.getAuthResponse();

        register(AccessToken);
        gapi.client.setToken({ access_token: AccessToken });

        if (handleDialogClose) {
          handleDialogClose(event);
        }

        navigate(AppRoutes.Home);
      })
      .catch(() => {
        Notify("Unable to authenticate", "error");
      });
  };

  public render(): React.ReactNode {
    const { isYoutubeConnected, classes, playlistCount, isMobile } = this.props;
    const { googleUser, loading, shareUrlId } = this.state;

    if (loading) {
      return <CircularProgress style={{ marginTop: "13%", marginLeft: "45%", color: "black" }} />;
    }

    if (!isYoutubeConnected || !googleUser) {
      return (
        <Grid item={true} className={classes.loginButton} xs={12}>
          <Button
            className={classes.button}
            variant="outlined"
            onClick={this.youtubeLogin}
            endIcon={<Avatar className={classes.avatar} src={youtubeIcon} />}>
            <Typography fontFamily="Poppins, sans-serif">Login via Youtube</Typography>
          </Button>
        </Grid>
      );
    }

    const imageUrl = googleUser.getImageUrl();
    const name = googleUser.getName();
    const email = googleUser.getEmail();
    const url = `youtube.com/channel/${shareUrlId}/playlists`;

    return (
      <Grid container={true} style={{ overflow: "clip", maxWidth: 552, minHeight: 200 }}>
        <Grid item={true} xs={4} className={classes.contentStyles}>
          <img src={imageUrl} alt="me" className={classes.profilePicture} />
        </Grid>
        <Grid container={true} item={true} xs={isMobile ? 12 : 8} style={{ flexDirection: "column" }}>
          <Grid item={true} xs={4} className={classes.typographyStyles}>
            <Typography fontFamily="Poppins,sans-serif">{name}</Typography>
          </Grid>
          <Grid item={true} xs={4} className={classes.typographyStyles}>
            <Typography fontFamily="Poppins,sans-serif">{email}</Typography>
          </Grid>
          <br />
          <br />
          <Grid item={true} xs={4} className={classes.typographyStyles}>
            <Typography fontFamily="Poppins,sans-serif">Playlists: {playlistCount}</Typography>
          </Grid>
          <Grid item={true} xs={4} className={classes.typographyBreak}>
            <Typography style={{ wordBreak: "break-all" }} fontFamily="Poppins,sans-serif">
              Me: {url}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const HeaderSettingsDialogYouTube = React.memo<OuterProps>((props) => {
  const { googleAuthObject, register } = useYoutubeAuth();
  const classes = useSettingsStyles();
  const navigate = useNavigate();

  const theme = useTheme<AppTheme>();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <HeaderSettingsDialogYouTubeClass
      {...props}
      navigate={navigate}
      isMobile={isMobile}
      register={register}
      googleAuthObject={googleAuthObject}
      classes={classes}
    />
  );
});
