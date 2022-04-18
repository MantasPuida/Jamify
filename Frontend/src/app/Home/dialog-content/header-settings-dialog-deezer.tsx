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
import Flags from "country-flag-icons/react/3x2";
import { WithStyles } from "@mui/styles";
import { SettingsStyles, useSettingsStyles } from "./settings.styles";
import deezerIcon from "../../../assets/dashboard/Deezer_Icon_Black.png";
import { DeezerConstants } from "../../../constants/constants-deezer";
import { AppRoutes } from "../../routes/routes";
import { Notify } from "../../notification/notification-component";
import { useDeezerAuth } from "../../../context/deezer-context";
import { AppTheme } from "../../../shared/app-theme";

import "./fontFamily.css";

interface OuterProps {
  isDeezerConnected: boolean;
  handleDialogClose: ButtonProps["onClick"];
  playlistCount: number;
}

interface InnerProps extends WithStyles<typeof SettingsStyles> {
  navigate: NavigateFunction;
  register: Function;
  deezerToken: string | null;
  setDeezerUserId: Function;
  isMobile: boolean;
}

interface ProfileData {
  userName: string;
  email: string;
  pictureUrl: string;
  link: string;
  country: string;
}

interface State {
  loading: boolean;
  deezerProfile?: ProfileData;
}

type Props = InnerProps & OuterProps;

class HeaderSettingsDialogDeezerClass extends React.PureComponent<Props, State> {
  public state: State = { loading: true };

  constructor(props: Props) {
    super(props);

    this.fetchUserData(props.deezerToken);
  }

  private fetchUserData = (token: string | null): void => {
    DZ.api(`/user/me?access_token=${token}`, (value) => {
      this.setState({
        deezerProfile: {
          country: value.country,
          email: value.email,
          pictureUrl: value.picture_big,
          userName: value.name,
          link: value.link
        },
        loading: false
      });
    });
  };

  private deezerLogin: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { register, navigate, handleDialogClose, setDeezerUserId } = this.props;

    DZ.login(
      (response) => {
        const { status, authResponse, userID } = response;

        if (status === "connected" && authResponse.accessToken) {
          const { accessToken } = authResponse;

          register(accessToken);
          setDeezerUserId(userID);

          if (handleDialogClose) {
            handleDialogClose(event);
          }

          navigate(AppRoutes.Home);
        } else {
          Notify("Unable to authenticate", "error");
        }
      },
      { perms: DeezerConstants.scopes.join(",") }
    );
  };

  public render(): React.ReactNode {
    const { isDeezerConnected, classes, playlistCount, isMobile } = this.props;
    const { deezerProfile, loading } = this.state;

    if (loading) {
      return <CircularProgress style={{ marginTop: "13%", marginLeft: "45%", color: "black" }} />;
    }

    if (!isDeezerConnected || !deezerProfile) {
      return (
        <Grid item={true} className={classes.loginButton} xs={12}>
          <Button
            className={classes.button}
            variant="outlined"
            onClick={this.deezerLogin}
            endIcon={<Avatar className={classes.avatar} src={deezerIcon} />}>
            <Typography fontFamily="Poppins, sans-serif">Login via Deezer</Typography>
          </Button>
        </Grid>
      );
    }

    const { email, pictureUrl, userName, link, country } = deezerProfile;
    let deezerLink = "";
    if (link) {
      deezerLink = link.replace("https://www.", "");
    }

    return (
      <Grid container={true}>
        <Grid item={true} xs={4} className={classes.contentStyles}>
          <img src={pictureUrl} alt="me" className={classes.profilePicture} />
        </Grid>
        <Grid container={true} item={true} xs={isMobile ? 12 : 8} style={{ flexDirection: "column" }}>
          <Grid item={true} xs={4} className={classes.typographyStyles}>
            <Typography fontFamily="Poppins,sans-serif">{userName}</Typography>
          </Grid>
          <Grid item={true} xs={4} className={classes.typographyStyles}>
            <Typography fontFamily="Poppins,sans-serif">{email}</Typography>
          </Grid>
          <br />
          <br />
          <br />
          <Grid item={true} xs={12} className={classes.typographyStyles}>
            <Typography fontFamily="Poppins,sans-serif" style={{ float: "left" }}>
              Country: {country}
            </Typography>
            {country === "LT" && <Flags.LT title={country} style={{ maxWidth: 20, paddingLeft: 8, marginTop: 4 }} />}
          </Grid>
          <Grid item={true} xs={4} className={classes.typographyStyles}>
            <Typography fontFamily="Poppins,sans-serif">Playlists: {playlistCount}</Typography>
          </Grid>
          <Grid item={true} xs={12} className={classes.typographyStyles}>
            <Typography fontFamily="Poppins,sans-serif" style={{ float: "left", paddingRight: 8 }}>
              Me:
            </Typography>
            <Button
              variant="text"
              style={{ padding: 0 }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                window.open(link, "_blank");
              }}>
              <Typography fontFamily="Poppins,sans-serif" style={{ textTransform: "none" }}>
                {deezerLink}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const HeaderSettingsDialogDeezer = React.memo<OuterProps>((props) => {
  const { register, deezerToken, setDeezerUserId } = useDeezerAuth();
  const navigate = useNavigate();
  const classes = useSettingsStyles();

  const theme = useTheme<AppTheme>();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <HeaderSettingsDialogDeezerClass
      {...props}
      isMobile={isMobile}
      setDeezerUserId={setDeezerUserId}
      deezerToken={deezerToken}
      register={register}
      navigate={navigate}
      classes={classes}
    />
  );
});
