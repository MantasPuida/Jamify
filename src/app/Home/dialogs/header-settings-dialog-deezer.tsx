import * as React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { SettingsStyles, useSettingsStyles } from "./settings.styles";

import "./fontFamily.css";

interface OuterProps {
  isDeezerConnected: boolean;
}

type InnerProps = WithStyles<typeof SettingsStyles>;

interface ProfileData {
  userName: string;
  email: string;
  pictureUrl: string;
}

interface State {
  deezerProfile?: ProfileData;
}

type Props = InnerProps & OuterProps;

class HeaderSettingsDialogDeezerClass extends React.PureComponent<Props, State> {
  public state: State = {};

  constructor(props: Props) {
    super(props);

    this.fetchUserData();
  }

  private fetchUserData = (): void => {
    DZ.api("/user/me", (value) => {
      this.setState({
        deezerProfile: {
          email: value.email,
          pictureUrl: value.picture_big,
          userName: value.name
        }
      });
    });
  };

  public render(): React.ReactNode {
    const { isDeezerConnected } = this.props;
    const { deezerProfile } = this.state;

    if (!isDeezerConnected || !deezerProfile) {
      return <Button>Login To Deezer</Button>;
    }

    const { email, pictureUrl, userName } = deezerProfile;

    return (
      <Grid container={true}>
        <Grid item={true} xs={4} style={{ maxWidth: "32%", width: "100%" }}>
          <img src={pictureUrl} alt="me" style={{ maxWidth: 160, borderRadius: 5 }} />
        </Grid>
        <Grid container={true} item={true} xs={8} style={{ flexDirection: "column" }}>
          <Grid item={true} xs={4} style={{ maxHeight: "24px", minWidth: 300, paddingLeft: 16, paddingTop: 16 }}>
            <Typography fontFamily="Poppins,sans-serif">{userName}</Typography>
          </Grid>
          <Grid item={true} xs={4} style={{ maxHeight: "24px", minWidth: 300, paddingLeft: 16, paddingTop: 16 }}>
            <Typography fontFamily="Poppins,sans-serif">{email}</Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const HeaderSettingsDialogDeezer = React.memo<OuterProps>((props) => {
  const classes = useSettingsStyles();

  return <HeaderSettingsDialogDeezerClass {...props} classes={classes} />;
});
