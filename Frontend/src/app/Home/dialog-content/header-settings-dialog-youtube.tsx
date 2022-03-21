import * as React from "react";
import { NavigateFunction, useNavigate } from "react-router";
import { Avatar, Button, ButtonProps, CircularProgress, Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { useYoutubeAuth } from "../../../context/youtube-context";
import { SettingsStyles, useSettingsStyles } from "./settings.styles";
import youtubeIcon from "../../../assets/dashboard/Youtube_Icon_Black.png";
import { AppRoutes } from "../../routes/routes";
import { Notify } from "../../notification/notification-component";

import "./fontFamily.css";

interface OuterProps {
  isYoutubeConnected: boolean;
  handleDialogClose: ButtonProps["onClick"];
}

interface InnerProps extends WithStyles<typeof SettingsStyles> {
  googleAuthObject: gapi.auth2.GoogleAuthBase | undefined;
  register: Function;
  navigate: NavigateFunction;
}

interface State {
  loading: boolean;
  googleUser?: gapi.auth2.BasicProfile;
}

type Props = InnerProps & OuterProps;

class HeaderSettingsDialogYouTubeClass extends React.PureComponent<Props, State> {
  public state: State = { loading: true };

  constructor(props: Props) {
    super(props);

    this.fetchUserData(props.googleAuthObject);
  }

  private fetchUserData = (googleAuthObject: gapi.auth2.GoogleAuthBase | undefined): void => {
    const googleUserObject = googleAuthObject?.currentUser.get().getBasicProfile();

    this.state = {
      googleUser: googleUserObject,
      loading: false
    };
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
    const { isYoutubeConnected, classes } = this.props;
    const { googleUser, loading } = this.state;

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

    return (
      <Grid container={true}>
        <Grid item={true} xs={4} style={{ maxWidth: "32%" }}>
          <img src={imageUrl} alt="me" style={{ maxWidth: 160, borderRadius: 5, width: "100%" }} />
        </Grid>
        <Grid container={true} item={true} xs={8} style={{ flexDirection: "column" }}>
          <Grid item={true} xs={4} style={{ maxHeight: "24px", minWidth: 300, paddingLeft: 16, paddingTop: 16 }}>
            <Typography fontFamily="Poppins,sans-serif">{name}</Typography>
          </Grid>
          <Grid item={true} xs={4} style={{ maxHeight: "24px", minWidth: 300, paddingLeft: 16, paddingTop: 16 }}>
            <Typography fontFamily="Poppins,sans-serif">{email}</Typography>
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

  return (
    <HeaderSettingsDialogYouTubeClass
      {...props}
      navigate={navigate}
      register={register}
      googleAuthObject={googleAuthObject}
      classes={classes}
    />
  );
});
