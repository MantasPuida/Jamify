/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from "react";
import { Button, Grid, Typography, Grow } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { NavigateFunction, useNavigate } from "react-router";
import { DeezerStyles, useDeezerStyles } from "./deezer.styles";
import { Playlist } from "../../../types/deezer.types";
import { useAppContext } from "../../../context/app-context";
import { AppRoutes } from "../../routes/routes";

import "./carousel-items.css";
import { FeaturedPlaylistState } from "../featured-playlists/featured-card";

interface OuterProps {
  playlist: Playlist;
  changeState: () => void;
  loading: boolean;
}

interface InnerProps extends WithStyles<typeof DeezerStyles> {
  navigate: NavigateFunction;
  setLoading: Function;
}

type Props = InnerProps & OuterProps;

interface State {
  isImageLoading: boolean;
}

class DeezerPlaylistsClass extends React.PureComponent<Props, State> {
  public state: State = { isImageLoading: true };

  componentDidMount() {
    const { setLoading, changeState } = this.props;

    setLoading(false);
    changeState();
  }

  private handleOnCardClick: React.MouseEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { navigate, playlist } = this.props;

    navigate(AppRoutes.Playlist, { state: { deezerAlbum: playlist, myOwn: false } as FeaturedPlaylistState });
  };

  public render(): React.ReactNode {
    const { classes, playlist, loading } = this.props;
    const { isImageLoading } = this.state;

    if (loading) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    return (
      <Grow in={!loading && !isImageLoading} style={{ transformOrigin: "0 0 0" }} {...{ timeout: 1000 }}>
        <Grid container={true} item={true} xs={12} key={playlist.id}>
          <Grid container={true} item={true} xs={12} style={{ marginRight: 50 }}>
            <Grid item={true}>
              <Button style={{ color: "black" }}>
                {loading || (isImageLoading && <img src="" alt="" className={classes.dzImage} />)}
                <div className="tint-img">
                  <img
                    src={playlist.picture_xl}
                    alt={playlist.title}
                    className={classes.dzImage}
                    onClick={this.handleOnCardClick}
                    onLoad={() => this.setState({ isImageLoading: false })}
                    style={{ display: isImageLoading ? "none" : "block" }}
                  />
                </div>
              </Button>
            </Grid>
            <Grid item={true}>
              <Button className={classes.dzFeaturedText} onClick={this.handleOnCardClick}>
                <Typography className={classes.dzCarouselItemText} fontFamily="Poppins,sans-serif" color="white">
                  {playlist.title}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grow>
    );
  }
}

export const DeezerPlaylists = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();
  const classes = useDeezerStyles();
  const { setLoading } = useAppContext();

  return <DeezerPlaylistsClass {...props} setLoading={setLoading} navigate={navigate} classes={classes} />;
});
