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
  followers?: number;
  followedArtists?: number;
  topArtist?: string;
  savedAlbums?: number;
  savedTracks?: number;
}

type Props = InnerProps & OuterProps;

class HeaderSettingsDialogSpotifyClass extends React.PureComponent<Props, State> {
  public state: State;

  constructor(props: Props) {
    super(props);

    this.state = { loading: true };

    this.fetchUserData(props.spotifyApi);
    this.fetchStats(props.spotifyApi);
  }

  private fetchStats = (spotifyApi: SpotifyWebApi): void => {
    this.setState({ loading: true });

    spotifyApi.getMe().then((me) =>
      spotifyApi.getFollowedArtists().then((artists) =>
        spotifyApi.getMyTopArtists().then((topArtists) =>
          spotifyApi.getMySavedAlbums().then((mySavedAlbums) =>
            spotifyApi.getMySavedTracks().then((mySavedTracks) =>
              this.setState({
                followers: me.body.followers?.total,
                followedArtists: artists.body.artists.total,
                topArtist: topArtists.body.items[0].name,
                savedAlbums: mySavedAlbums.body.total,
                savedTracks: mySavedTracks.body.total,
                loading: false
              })
            )
          )
        )
      )
    );
  };

  private fetchUserData = (spotifyApi: SpotifyWebApi): void => {
    spotifyApi
      .getMe()
      .then((callback) => {
        this.setState({ spotifyProfile: callback.body });
      })
      .catch((err) => {
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
    const { spotifyProfile, loading, followers, savedAlbums, savedTracks, followedArtists, topArtist } = this.state;

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

    // eslint-disable-next-line react/jsx-no-useless-fragment
    const statsJsx: JSX.Element[] = [<></>];

    if (followers && followers > 0) {
      statsJsx.push(<Typography fontFamily="Poppins,sans-serif">Followers: {followers}</Typography>);
    }

    if (savedAlbums && savedAlbums > 0) {
      statsJsx.push(<Typography fontFamily="Poppins,sans-serif">Saved Albums: {savedAlbums}</Typography>);
    }

    if (savedTracks && savedTracks > 0) {
      statsJsx.push(<Typography fontFamily="Poppins,sans-serif">Saved Tracks: {savedTracks}</Typography>);
    }

    if (followedArtists && followedArtists > 0) {
      statsJsx.push(<Typography fontFamily="Poppins,sans-serif">Followed Artists: {followedArtists}</Typography>);
    }

    if (topArtist) {
      statsJsx.push(<Typography fontFamily="Poppins,sans-serif">Top Artist: {topArtist}</Typography>);
    }

    return (
      <Grid container={true}>
        <Grid item={true} xs={4} style={{ maxWidth: "32%" }}>
          <img src={images[0].url} alt="me" style={{ maxWidth: 160, borderRadius: 5 }} />
        </Grid>
        <Grid container={true} item={true} xs={8} style={{ flexDirection: "column" }}>
          <Grid item={true} xs={4} style={{ maxHeight: "24px", minWidth: 300, paddingLeft: 16 }}>
            <Typography fontFamily="Poppins,sans-serif">{displayName ?? "User"}</Typography>
          </Grid>
          <Grid item={true} xs={4} style={{ maxHeight: "24px", minWidth: 300, paddingLeft: 16 }}>
            <Typography fontFamily="Poppins,sans-serif">{email}</Typography>
          </Grid>
          <br />
          {statsJsx.map((jsx) => (
            <Grid item={true} xs={12} style={{ maxHeight: "24px", minWidth: 300, paddingLeft: 16 }}>
              {jsx}
            </Grid>
          ))}
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
