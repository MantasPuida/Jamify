/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { NavigateFunction, useNavigate } from "react-router";
import { YoutubeTracksStyles, useYoutubeTracksStyles } from "./playlist.styles";
import { useAppContext } from "../../context/app-context";
import { extractThumbnail } from "../../helpers/thumbnails";
import { LastTick } from "../../utils/last-tick";
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

class YoutubePlaylistsClass extends React.PureComponent<Props> {
  componentDidMount() {
    const { setLoading, shouldSetLoading, changeLoading } = this.props;

    if (shouldSetLoading) {
      setLoading(false);
    }

    setTimeout(() => {
      LastTick(() => {
        changeLoading();
      });
    }, 1000);
  }

  private handleOnCardClick: React.MouseEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate, playlist } = this.props;

    navigate(AppRoutes.Playlist, { state: { youtubePlaylist: playlist, myOwn: false } as FeaturedPlaylistState });
  };

  public render(): React.ReactNode {
    const { classes, playlist, loading } = this.props;

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
      <Grid container={true} item={true} xs={12} key={playlist.id}>
        <Grid container={true} item={true} xs={12} style={{ marginRight: 50 }}>
          <Grid item={true}>
            <Button style={{ color: "black" }}>
              <div className="tint-img">
                <img
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
    );
  }
}

export const YoutubePlaylistsCards = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();
  const classes = useYoutubeTracksStyles();
  const { setLoading } = useAppContext();

  return <YoutubePlaylistsClass {...props} setLoading={setLoading} navigate={navigate} classes={classes} />;
});
