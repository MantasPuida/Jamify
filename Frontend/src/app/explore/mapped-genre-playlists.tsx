import * as React from "react";
import { WithStyles } from "@mui/styles";
import { Grid, Typography, Button, ButtonProps } from "@mui/material";
import SpotifyWebApi from "spotify-web-api-node";
import { NavigateFunction, useNavigate } from "react-router";
import { ExploreStyles, useExploreStyles } from "./explore.styles";
import { useAppContext } from "../../context/app-context";
import { AppRoutes } from "../routes/routes";
import { FeaturedPlaylistState } from "../Home/featured-playlists/featured-card";

interface InnerProps extends WithStyles<typeof ExploreStyles> {
  navigate: NavigateFunction;
  setLoading: Function;
}

interface OuterProps {
  playlist: SpotifyApi.PlaylistObjectSimplified;
  spotifyApi: SpotifyWebApi;
}

type Props = InnerProps & OuterProps;

class MappedGenrePlaylistsClass extends React.PureComponent<Props> {
  componentDidMount() {
    const { setLoading } = this.props;

    setLoading(false);
  }

  private handleOnClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate, playlist: spotifyPlaylist } = this.props;

    navigate(AppRoutes.Playlist, { state: { spotifyPlaylist, myOwn: false } as FeaturedPlaylistState });
  };

  public render(): React.ReactNode {
    const { playlist, classes } = this.props;

    if (playlist.images.length === 0) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    return (
      <Grid container={true} item={true} xs={12} style={{ paddingBottom: 32 }}>
        <Grid item={true} xs={12}>
          <Button style={{ color: "black", padding: 0 }} onClick={this.handleOnClick}>
            <div className="tint-img">
              <img
                src={playlist.images[0].url}
                alt={playlist.name}
                style={{ maxWidth: 220, maxHeight: 220, objectFit: "scale-down" }}
              />
            </div>
          </Button>
        </Grid>
        <Grid item={true} xs={12}>
          <Button variant="text" className={classes.genreName}>
            <Typography color="white" fontSize={20} fontWeight={200} fontFamily="Poppins,sans-serif">
              {playlist.name}
            </Typography>
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export const MappedGenrePlaylists = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();
  const classes = useExploreStyles();
  const { setLoading } = useAppContext();

  return <MappedGenrePlaylistsClass setLoading={setLoading} classes={classes} {...props} navigate={navigate} />;
});
