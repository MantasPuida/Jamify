/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { NavigateFunction, useNavigate } from "react-router";
import { FeaturedPlaylistsStyles, useFeaturedPlaylistsStyles } from "./featured.styles";
import { AppRoutes } from "../../routes/routes";
// eslint-disable-next-line import/no-cycle
import { PlaylistType } from "../../me/me-component";
import { Album, PlaylistsResponse } from "../../../types/deezer.types";

import "./carousel-items.css";
import { useAppContext } from "../../../context/app-context";

interface OuterProps {
  playlist: SpotifyApi.PlaylistObjectSimplified;
  shouldSetLoading: boolean;
  changeState: () => void;
}

interface InnerProps extends WithStyles<typeof FeaturedPlaylistsStyles> {
  navigate: NavigateFunction;
  setLoading: Function;
}

export interface FeaturedPlaylistState {
  youtubePlaylist?: gapi.client.youtube.Playlist;
  spotifyPlaylist?: SpotifyApi.PlaylistObjectSimplified;
  deezerAlbum?:
    | Album
    | Omit<
        PlaylistsResponse,
        "collaborative" | "creator" | "duration" | "fans" | "is_loved_track" | "time_add" | "time_mod"
      >;
  ownPlaylist?: PlaylistType;
  myOwn?: boolean;
}

type Props = InnerProps & OuterProps;

class FeaturedCardClass extends React.PureComponent<Props> {
  componentDidMount() {
    const { setLoading, shouldSetLoading, changeState } = this.props;

    if (shouldSetLoading) {
      setLoading(false);
    }

    setTimeout(() => {
      changeState();
    }, 1000);
  }

  private handleOnCardClick: React.MouseEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate, playlist } = this.props;

    navigate(AppRoutes.Playlist, { state: { spotifyPlaylist: playlist } as FeaturedPlaylistState });
  };

  public render(): React.ReactNode {
    const { classes, playlist } = this.props;

    return (
      <Grid container={true} item={true} xs={12} key={playlist.id}>
        <Grid container={true} item={true} xs={12} style={{ marginRight: 50 }}>
          <Grid item={true}>
            <Button style={{ color: "black" }}>
              <div className="tint-img">
                <img
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  className={classes.image}
                  onClick={this.handleOnCardClick}
                />
              </div>
            </Button>
          </Grid>
          <Grid item={true}>
            <Button className={classes.featuredText} onClick={this.handleOnCardClick}>
              <Typography className={classes.carouselItemText} fontFamily="Poppins,sans-serif" color="white">
                {playlist.name}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const FeaturedCard = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();
  const classes = useFeaturedPlaylistsStyles();
  const { setLoading } = useAppContext();

  return <FeaturedCardClass {...props} setLoading={setLoading} navigate={navigate} classes={classes} />;
});
