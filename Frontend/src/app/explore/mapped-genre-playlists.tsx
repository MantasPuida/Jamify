import * as React from "react";
import { WithStyles } from "@mui/styles";
import { Grid, Typography, Button, ButtonProps, Grow } from "@mui/material";
import SpotifyWebApi from "spotify-web-api-node";
import { NavigateFunction, useNavigate } from "react-router";
import { ExploreStyles, useExploreStyles } from "./explore.styles";
import { useAppContext } from "../../context/app-context";
import { AppRoutes } from "../routes/routes";
import { FeaturedPlaylistState } from "../Home/featured-playlists/featured-card";
import { OmittedPlaylistResponse, SearchPlaylistData } from "../../types/deezer.types";

interface InnerProps extends WithStyles<typeof ExploreStyles> {
  navigate: NavigateFunction;
  setLoading: Function;
}

interface OuterProps {
  playlist: SpotifyApi.PlaylistObjectSimplified | SearchPlaylistData;
  src: "spotify" | "deezer";
  spotifyApi: SpotifyWebApi;
}

type Props = InnerProps & OuterProps;

interface State {
  isImageLoading: boolean;
}

class MappedGenrePlaylistsClass extends React.PureComponent<Props, State> {
  public state: State = { isImageLoading: true };

  componentDidMount() {
    const { setLoading } = this.props;

    setLoading(false);
  }

  private handleOnClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate, playlist, src } = this.props;

    if (src === "spotify") {
      navigate(AppRoutes.Playlist, {
        state: {
          spotifyPlaylist: playlist as SpotifyApi.PlaylistObjectSimplified,
          myOwn: false
        } as FeaturedPlaylistState
      });
    } else {
      navigate(AppRoutes.Playlist, {
        state: { deezerAlbum: playlist as OmittedPlaylistResponse, myOwn: false } as FeaturedPlaylistState
      });
    }
  };

  public render(): React.ReactNode {
    const { playlist: unknownPlaylist, classes, src } = this.props;
    const { isImageLoading } = this.state;

    if (src === "spotify") {
      const playlist = unknownPlaylist as SpotifyApi.PlaylistObjectSimplified;
      if (playlist.images.length === 0) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <></>;
      }

      return (
        <Grow in={!isImageLoading} style={{ transformOrigin: "0 0 0" }} {...{ timeout: 1000 }}>
          <Grid container={true} item={true} xs={12} style={{ paddingBottom: 32, maxWidth: 222 }}>
            <Grid item={true} xs={12}>
              <Button style={{ color: "black", padding: 0 }} onClick={this.handleOnClick}>
                {isImageLoading && (
                  <img src="" alt="dummy" style={{ maxWidth: 220, maxHeight: 220, objectFit: "scale-down" }} />
                )}
                <div className="tint-img">
                  <img
                    onLoad={() => this.setState({ isImageLoading: false })}
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    style={{
                      maxWidth: 220,
                      maxHeight: 220,
                      objectFit: "scale-down",
                      display: isImageLoading ? "none" : "block"
                    }}
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
        </Grow>
      );
    }
    const playlist = unknownPlaylist as SearchPlaylistData;

    return (
      <Grow in={!isImageLoading} style={{ transformOrigin: "0 0 0" }} {...{ timeout: 1000 }}>
        <Grid container={true} item={true} xs={12} style={{ paddingBottom: 32, maxWidth: 222 }}>
          <Grid item={true} xs={12}>
            <Button style={{ color: "black", padding: 0 }} onClick={this.handleOnClick}>
              <div className="tint-img">
                {isImageLoading && (
                  <img src="" alt="dummy" style={{ maxWidth: 220, maxHeight: 220, objectFit: "scale-down" }} />
                )}
                <img
                  src={playlist.picture_xl}
                  alt={playlist.title}
                  onLoad={() => this.setState({ isImageLoading: false })}
                  style={{
                    maxWidth: 220,
                    maxHeight: 220,
                    objectFit: "scale-down",
                    display: isImageLoading ? "none" : "block"
                  }}
                />
              </div>
            </Button>
          </Grid>
          <Grid item={true} xs={12}>
            <Button variant="text" className={classes.genreName}>
              <Typography color="white" fontSize={20} fontWeight={200} fontFamily="Poppins,sans-serif">
                {playlist.title}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grow>
    );
  }
}

export const MappedGenrePlaylists = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();
  const classes = useExploreStyles();
  const { setLoading } = useAppContext();

  return <MappedGenrePlaylistsClass setLoading={setLoading} classes={classes} {...props} navigate={navigate} />;
});
