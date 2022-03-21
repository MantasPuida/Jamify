import * as React from "react";
import { Button, ButtonProps, Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { useNavigate, NavigateFunction } from "react-router";
import { SpotifyPlaylistsStyles, useSpotifyPlaylistsStyles } from "./playlists.styles";
import { extractThumbnail } from "../../helpers/thumbnails";
import { AppRoutes } from "../routes/routes";

import "./carousel-items.css";
import { FeaturedPlaylistState } from "../Home/featured-playlists/featured-card";

interface OuterProps {
  youtubePlaylist?: gapi.client.youtube.Playlist;
  spotifyPlaylist?: SpotifyApi.PlaylistObjectSimplified;
}

interface InnerProps extends WithStyles<typeof SpotifyPlaylistsStyles> {
  navigate: NavigateFunction;
}

type Props = InnerProps & OuterProps;

class PlaylistCardClass extends React.PureComponent<Props> {
  private handleOnPlaylistClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate, spotifyPlaylist, youtubePlaylist } = this.props;

    if (spotifyPlaylist) {
      navigate(AppRoutes.Playlist, { state: { spotifyPlaylist } as FeaturedPlaylistState });
    } else if (youtubePlaylist) {
      navigate(AppRoutes.Playlist, { state: { youtubePlaylist } as FeaturedPlaylistState });
    }
  };

  public render(): React.ReactNode {
    const { classes, spotifyPlaylist, youtubePlaylist } = this.props;

    let id: string = "";
    let name: string = "";
    let image: string | undefined = "";

    if (spotifyPlaylist) {
      id = spotifyPlaylist.id;
      name = spotifyPlaylist.name;
      image = spotifyPlaylist.images[0].url;
    } else if (youtubePlaylist && youtubePlaylist.id && youtubePlaylist.snippet) {
      id = youtubePlaylist.id;
      const { snippet } = youtubePlaylist;

      if (snippet.thumbnails && snippet.title) {
        name = snippet.title;
        image = extractThumbnail(snippet.thumbnails);
      }
    }

    return (
      <Grid container={true} item={true} xs={12} key={id}>
        <Grid container={true} item={true} xs={12}>
          <Grid item={true}>
            <Button style={{ color: "transparent", paddingLeft: 0 }} onClick={this.handleOnPlaylistClick}>
              <div className="tint-img">
                <img src={image} alt={name} className={classes.image} height={160} width={160} />
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
  const classes = useSpotifyPlaylistsStyles();
  const navigate = useNavigate();

  return <PlaylistCardClass {...props} navigate={navigate} classes={classes} />;
});
