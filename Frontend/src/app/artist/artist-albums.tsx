import * as React from "react";
import { Grid, Typography, Button, ButtonProps } from "@mui/material";
import { NavigateFunction, useNavigate } from "react-router";
import { WithStyles } from "@mui/styles";
import { ArtistStyles, useArtistStyles } from "./artist.styles";
import { Album } from "../../types/deezer.types";
import { AppRoutes } from "../routes/routes";
import { FeaturedPlaylistState } from "../Home/featured-playlists/featured-card";

import "./fontFamily.css";
import "./image-tint.css";

interface OuterProps {
  album: Album;
}

interface InnerProps extends WithStyles<typeof ArtistStyles> {
  navigate: NavigateFunction;
}

type Props = InnerProps & OuterProps;

class ArtistAlbumsClass extends React.PureComponent<Props> {
  private handleOnClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { album: deezerAlbum, navigate } = this.props;

    navigate(AppRoutes.Playlist, { state: { deezerAlbum, myOwn: false } as FeaturedPlaylistState });
  };

  public render(): React.ReactNode {
    const { album, classes } = this.props;

    return (
      <Grid item={true} xs={2} style={{ paddingBottom: 24 }}>
        <Grid container={true} item={true} xs={12}>
          <Grid item={true}>
            <Button onClick={this.handleOnClick} style={{ padding: 0, color: "transparent" }}>
              <img className="tint-img" src={album.cover_xl} alt={album.title} style={{ maxWidth: 220 }} />
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
                by {album.artist.name}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const ArtistAlbums = React.memo<OuterProps>((props) => {
  const classes = useArtistStyles();
  const navigate = useNavigate();

  return <ArtistAlbumsClass classes={classes} navigate={navigate} {...props} />;
});
