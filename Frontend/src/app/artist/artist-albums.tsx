import * as React from "react";
import { Grid, Typography, Button, ButtonProps, Grow } from "@mui/material";
import { NavigateFunction, useNavigate } from "react-router";
import { WithStyles } from "@mui/styles";
import { ArtistStyles, useArtistStyles } from "./artist.styles";
import { Album } from "../../types/deezer.types";
import { AppRoutes } from "../routes/routes";
import { FeaturedPlaylistState } from "../Home/featured-playlists/featured-card";

import "./fontFamily.css";
import "./image-tint.css";

interface Artist {
  id: number;
  name: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
}

interface OuterProps {
  album: Album;
}

interface InnerProps extends WithStyles<typeof ArtistStyles> {
  navigate: NavigateFunction;
  artist?: Artist;
}

type Props = InnerProps & OuterProps;

interface State {
  isImageLoading: boolean;
}

class ArtistAlbumsClass extends React.PureComponent<Props, State> {
  public state: State = { isImageLoading: true };

  private handleOnClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { album: deezerAlbum, navigate } = this.props;

    navigate(AppRoutes.Playlist, { state: { deezerAlbum, myOwn: false } as FeaturedPlaylistState });
  };

  public render(): React.ReactNode {
    const { album, classes, artist } = this.props;
    const { isImageLoading } = this.state;

    return (
      <Grow in={!isImageLoading} style={{ transformOrigin: "0 0 0" }} {...{ timeout: 1000 }}>
        <Grid item={true} xs={2} style={{ paddingBottom: 24 }}>
          <Grid container={true} item={true} xs={12}>
            <Grid item={true}>
              <Button onClick={this.handleOnClick} style={{ padding: 0, color: "transparent" }}>
                {isImageLoading && <img src="" alt="dummy" style={{ maxWidth: 220, maxHeight: 220 }} />}
                <img
                  className="tint-img"
                  src={album.cover_xl}
                  alt={album.title}
                  style={{ maxWidth: 220, display: isImageLoading ? "none" : "block" }}
                  onLoad={() => this.setState({ isImageLoading: false })}
                />
              </Button>
            </Grid>
            <Grid item={true} xs={12}>
              <Button
                onClick={this.handleOnClick}
                style={{ padding: 0, textTransform: "none", justifyContent: "start", color: "transparent" }}>
                <Typography className={classes.typography} fontFamily="Poppins, sans-serif" color="white">
                  {album.title}
                </Typography>
              </Button>
            </Grid>
            <Grid item={true} xs={12}>
              <Button
                onClick={this.handleOnClick}
                style={{ padding: 0, textTransform: "none", justifyContent: "start", color: "transparent" }}>
                <Typography className={classes.typography} fontFamily="sans-serif" color="white">
                  by {artist?.name}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grow>
    );
  }
}

export const ArtistAlbums = React.memo<OuterProps>((props) => {
  const [artist, setArtist] = React.useState<Artist>();
  const classes = useArtistStyles();
  const navigate = useNavigate();
  const { album } = props;

  DZ.api(`album/${album.id}`, (response) => {
    if (response.artist) {
      setArtist(response.artist);
    }
  });

  return <ArtistAlbumsClass artist={artist} classes={classes} navigate={navigate} {...props} />;
});
