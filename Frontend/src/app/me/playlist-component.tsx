/* eslint-disable import/no-cycle */
import * as React from "react";
import { Button, ButtonProps, Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import SpotifyWebApi from "spotify-web-api-node";
import { useNavigate, NavigateFunction } from "react-router";
import { SpotifyPlaylistsStyles, useSpotifyPlaylistsStyles } from "./playlists.styles";
import { extractThumbnail } from "../../helpers/thumbnails";
import { PlaylistType } from "./me-component";
import { AppRoutes } from "../routes/routes";
import { FeaturedPlaylistState } from "../Home/featured-playlists/featured-card";
import { PlaylistsResponse } from "../../types/deezer.types";
import { useAppContext } from "../../context/app-context";
import { LastTick } from "../../utils/last-tick";

import "./carousel-items.css";

interface OuterProps {
  youtubePlaylist?: gapi.client.youtube.Playlist;
  spotifyPlaylist?: SpotifyApi.PlaylistObjectSimplified;
  deezerPlaylist?: PlaylistsResponse;
  ownPlaylist?: PlaylistType;
  spotifyApi: SpotifyWebApi;
  shouldCancelLoader: boolean;
}

interface InnerProps extends WithStyles<typeof SpotifyPlaylistsStyles> {
  navigate: NavigateFunction;
  image?: string;
  setLoading: Function;
  loading: boolean;
}

type Props = InnerProps & OuterProps;

class PlaylistCardClass extends React.PureComponent<Props> {
  componentDidMount() {
    const { setLoading, shouldCancelLoader, loading } = this.props;

    if (shouldCancelLoader && loading) {
      LastTick(() => {
        setLoading(false);
      });
    }
  }

  private handleOnPlaylistClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate, spotifyPlaylist, youtubePlaylist, ownPlaylist, deezerPlaylist: deezerAlbum } = this.props;

    if (spotifyPlaylist) {
      navigate(AppRoutes.Playlist, { state: { spotifyPlaylist, myOwn: true } as FeaturedPlaylistState });
    } else if (youtubePlaylist) {
      navigate(AppRoutes.Playlist, { state: { youtubePlaylist, myOwn: true } as FeaturedPlaylistState });
    } else if (ownPlaylist) {
      navigate(AppRoutes.Playlist, { state: { ownPlaylist, myOwn: true } as FeaturedPlaylistState });
    } else if (deezerAlbum) {
      navigate(AppRoutes.Playlist, { state: { deezerAlbum, myOwn: true } as FeaturedPlaylistState });
    }
  };

  public render(): React.ReactNode {
    const { classes, spotifyPlaylist, youtubePlaylist, ownPlaylist, deezerPlaylist, image: myImage } = this.props;

    let id: string = "";
    let name: string = "";
    let image: string | undefined = "";

    if (spotifyPlaylist) {
      id = spotifyPlaylist.id;
      name = spotifyPlaylist.name;
      image = spotifyPlaylist.images.length > 0 ? spotifyPlaylist.images[0].url : myImage;
    } else if (youtubePlaylist && youtubePlaylist.id && youtubePlaylist.snippet) {
      id = youtubePlaylist.id;
      const { snippet } = youtubePlaylist;

      if (snippet.thumbnails && snippet.title) {
        name = snippet.title;
        image = extractThumbnail(snippet.thumbnails);
      }
    } else if (ownPlaylist) {
      id = ownPlaylist.playlistId;
      name = ownPlaylist.playlistName;
      image = ownPlaylist.playlistImage;
    } else if (deezerPlaylist) {
      id = deezerPlaylist.id.toString();
      name = deezerPlaylist.title;
      image = deezerPlaylist.picture_xl;
    }

    return (
      <Grid container={true} item={true} xs={12} key={id}>
        <Grid container={true} item={true} xs={12}>
          <Grid item={true}>
            <Button style={{ color: "transparent", paddingLeft: 0 }} onClick={this.handleOnPlaylistClick}>
              <div className="tint-img">
                <img src={image} alt={name} className={classes.image} />
              </div>
            </Button>
          </Grid>
          <Grid item={true} xs={12}>
            <Button className={classes.featuredText} onClick={this.handleOnPlaylistClick}>
              <Typography className={classes.carouselItemText} fontFamily="Poppins,sans-serif" color="white">
                {name}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const PlaylistCard = React.memo<OuterProps>((props) => {
  const [image, setImage] = React.useState<string | undefined>(undefined);
  const classes = useSpotifyPlaylistsStyles();
  const navigate = useNavigate();
  const { setLoading, loading } = useAppContext();
  const { spotifyPlaylist, spotifyApi } = props;

  if (spotifyPlaylist && spotifyPlaylist.images.length === 0) {
    spotifyApi.getPlaylistTracks(spotifyPlaylist.id).then((tracks) => {
      setImage(tracks.body.items[0].track.album.images[0].url);
    });
  }

  return (
    <PlaylistCardClass
      setLoading={setLoading}
      loading={loading}
      image={image}
      {...props}
      navigate={navigate}
      classes={classes}
    />
  );
});
