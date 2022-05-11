/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from "react";
import { Button, Grid, Grow, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { NavigateFunction, useNavigate } from "react-router";
import { YoutubeTracksStyles, useYoutubeTracksStyles } from "./playlist.styles";
import { useAppContext } from "../../context/app-context";
import { extractThumbnail } from "../../helpers/thumbnails";
import { FeaturedPlaylistState } from "../Home/featured-playlists/featured-card";
import { AppRoutes } from "../routes/routes";

import "./carousel-items.css";

interface OuterProps {
  playlist: gapi.client.youtube.Playlist;
  shouldSetLoading: boolean;
  changeLoading: () => void;
  loading: boolean;
}

interface InnerProps extends WithStyles<typeof YoutubeTracksStyles> {
  navigate: NavigateFunction;
  setLoading: Function;
}

type Props = InnerProps & OuterProps;

interface State {
  isImageLoading: boolean;
}

class YoutubePlaylistsClass extends React.PureComponent<Props, State> {
  public state: State = { isImageLoading: true };

  componentDidMount() {
    const { setLoading, shouldSetLoading, changeLoading } = this.props;

    if (shouldSetLoading) {
      setLoading(false);
    }

    changeLoading();
  }

  private handleOnCardClick: React.MouseEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate, playlist } = this.props;

    navigate(AppRoutes.Playlist, { state: { youtubePlaylist: playlist, myOwn: false } as FeaturedPlaylistState });
  };

  public render(): React.ReactNode {
    const { classes, playlist, loading } = this.props;
    const { isImageLoading } = this.state;

    if (loading) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    if (!playlist?.snippet?.thumbnails || !playlist?.snippet?.title) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    const img = extractThumbnail(playlist.snippet.thumbnails);

    return (
      <Grow in={!loading && !isImageLoading} style={{ transformOrigin: "0 0 0" }} {...{ timeout: 1000 }}>
        <Grid container={true} item={true} xs={12} key={playlist.id}>
          <Grid container={true} item={true} xs={12} style={{ marginRight: 50 }}>
            <Grid item={true}>
              <Button style={{ color: "black" }}>
                <div className="tint-img">
                  {isImageLoading && <img src="" alt="dummy" className={classes.ytImage} />}
                  <img
                    style={{ display: isImageLoading ? "none" : "block" }}
                    onLoad={() => this.setState({ isImageLoading: false })}
                    src={img ?? ""}
                    alt={playlist.snippet.title}
                    className={classes.ytImage}
                    onClick={this.handleOnCardClick}
                  />
                </div>
              </Button>
            </Grid>
            <Grid item={true}>
              <Button className={classes.ytFeaturedText} onClick={this.handleOnCardClick}>
                <Typography className={classes.ytCarouselItemText} fontFamily="Poppins,sans-serif" color="white">
                  {playlist.snippet.title}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grow>
    );
  }
}

export const YoutubePlaylistsCards = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();
  const classes = useYoutubeTracksStyles();
  const { setLoading } = useAppContext();

  return <YoutubePlaylistsClass {...props} setLoading={setLoading} navigate={navigate} classes={classes} />;
});
