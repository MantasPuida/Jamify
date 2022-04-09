import * as React from "react";
import Play from "mdi-material-ui/Play";
import DotsVertical from "mdi-material-ui/DotsVertical";
import { WithStyles } from "@mui/styles";
import { useNavigate, NavigateFunction } from "react-router";
import clsx from "clsx";
import SpotifyWebApi from "spotify-web-api-node";
import { Button, ButtonProps, Grid, IconButton, Typography, MenuItem, Menu, MenuItemProps } from "@mui/material";
import { PlaylistStyles, usePlaylistStyles } from "./playlist.styles";
import { extractThumbnail } from "../../helpers/thumbnails";
import { PlaylistType } from "../me/me-component";
import { Album, PlaylistsResponse } from "../../types/deezer.types";

import "./fontFamily.css";
import { Notify } from "../notification/notification-component";
import { AppRoutes } from "../routes/routes";
import { useDeezerAuth } from "../../context/deezer-context";
import { PlaylistApi } from "../../api/api-endpoints";
import { useUserContext } from "../../context/user-context";

export enum SourceType {
  Spotify,
  Youtube,
  Own,
  Deezer
}

type DeezerPlaylistType = Album | PlaylistsResponse;

interface OuterProps {
  playlist: SpotifyApi.PlaylistObjectSimplified | gapi.client.youtube.Playlist | PlaylistType | DeezerPlaylistType;
  sourceType: SourceType;
  spotifyApi: SpotifyWebApi;
  myOwn?: boolean;
}

interface InnerProps extends WithStyles<typeof PlaylistStyles> {
  image: string;
  navigate: NavigateFunction;
  deezerToken: string | null;
  userId?: string;
}

interface State {
  anchorEl: HTMLElement | null;
}

type Props = InnerProps & OuterProps;

class PlaylistComponentClass extends React.PureComponent<Props, State> {
  public state: State = { anchorEl: null };

  private handleOnClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  private parseDescription = (description: string | null): string | null => {
    if (description) {
      if (description.includes("<") || description.includes(">")) {
        const regex: RegExp = /<[^>]*>/gm;
        return description.replaceAll(regex, "");
      }

      return description;
    }

    return null;
  };

  private handleClose = () => {
    this.setState({ anchorEl: null });
  };

  private handleOnDotsClick = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  private handleOnDelete: MenuItemProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { playlist, sourceType, spotifyApi, myOwn, navigate, userId, deezerToken } = this.props;

    if (myOwn) {
      if (sourceType === SourceType.Spotify) {
        const currentPlaylist = playlist as SpotifyApi.PlaylistObjectSimplified;

        spotifyApi.unfollowPlaylist(currentPlaylist.id).then(() => {
          Notify("Playlist unfollowed", "success");

          navigate(AppRoutes.Me);
        });
      }

      if (sourceType === SourceType.Youtube) {
        const currentPlaylist = playlist as gapi.client.youtube.Playlist;

        if (currentPlaylist.id) {
          gapi.client.youtube.playlists
            .delete({
              id: currentPlaylist.id
            })
            .then(() => {
              Notify("Playlist deleted", "success");

              navigate(AppRoutes.Me);
            });
        }
      }

      if (sourceType === SourceType.Deezer) {
        const currentPlaylist = playlist as DeezerPlaylistType;

        if (currentPlaylist.id && deezerToken) {
          DZ.api(
            `playlist/${currentPlaylist.id}?access_token=${deezerToken}`,
            "DELETE",
            {
              playlist_id: currentPlaylist.id
            },
            (response) => {
              if (response.error) {
                Notify(response.error.message, "error");
              } else {
                Notify("Playlist deleted", "success");

                navigate(AppRoutes.Me);
              }
            }
          );
        }
      }

      if (sourceType === SourceType.Own) {
        const currentPlaylist = playlist as PlaylistType;

        const { PlaylistApiEndpoints } = PlaylistApi;

        if (currentPlaylist.playlistId && userId) {
          PlaylistApiEndpoints()
            .deletePlaylist(userId, currentPlaylist.playlistId)
            .then(() => {
              Notify("Playlist deleted", "success");

              navigate(AppRoutes.Me);
            });
        }
      }
    }
  };

  public render(): React.ReactNode {
    const { classes, playlist, sourceType, image: myImage, myOwn } = this.props;

    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    let playlistImage: string = "";
    let playlistName = "";
    let playlistDescription: string | null = "";

    if (sourceType === SourceType.Spotify) {
      const SpotifyPlaylist = playlist as SpotifyApi.PlaylistObjectSimplified;
      playlistImage = SpotifyPlaylist.images.length > 0 ? SpotifyPlaylist.images[0].url : myImage;
      playlistName = SpotifyPlaylist.name;
      playlistDescription = this.parseDescription(SpotifyPlaylist.description);
    } else if (sourceType === SourceType.Youtube) {
      const YoutubePlaylist = playlist as gapi.client.youtube.Playlist;

      if (YoutubePlaylist.snippet) {
        const { snippet } = YoutubePlaylist;

        const thumbnail = extractThumbnail(snippet.thumbnails);

        if (!thumbnail) {
          // eslint-disable-next-line react/jsx-no-useless-fragment
          return <></>;
        }

        playlistImage = thumbnail;
        playlistName = snippet.title ?? "My playlist";
      }
    } else if (sourceType === SourceType.Own) {
      const ownPlaylist = playlist as PlaylistType;
      playlistName = ownPlaylist.playlistName;
      playlistImage = ownPlaylist.playlistImage;
      playlistDescription = ownPlaylist.playlistDescription;
    } else if (sourceType === SourceType.Deezer) {
      const deezerPlaylist = playlist as DeezerPlaylistType;
      if (deezerPlaylist.type === "playlist") {
        const customPlaylist = deezerPlaylist as PlaylistsResponse;
        playlistImage = customPlaylist.picture_xl;
        playlistName = customPlaylist.title;
        playlistDescription = "";
      } else {
        const customPlaylist = deezerPlaylist as Album;
        playlistImage = customPlaylist.cover_xl;
        playlistName = customPlaylist.title;
        playlistDescription = "";
      }
    }

    return (
      <Grid container={true} className={classes.playlistsGrid}>
        <Grid item={true} xs={4} style={{ maxWidth: "35%" }}>
          <img src={playlistImage} alt={playlistName} className={classes.playlistImage} />
        </Grid>
        <Grid
          container={true}
          item={true}
          xs={8}
          className={clsx({ [classes.optionalGridText]: sourceType === SourceType.Spotify }, classes.playlistGridText)}>
          <Grid item={true}>
            <Typography fontFamily="Poppins, sans-serif" color="white" fontWeight={700} fontSize={45}>
              {playlistName}
            </Typography>
          </Grid>
          <Grid item={true} style={{ width: "100%" }}>
            <Typography fontWeight={400} fontSize={16} style={{ color: "rgba(255, 255, 255, .7)" }}>
              {playlistDescription}
            </Typography>
          </Grid>
          <Grid item={true} style={{ width: "100%", marginTop: 40 }}>
            <Button
              onClick={this.handleOnClick}
              style={{
                textTransform: "none",
                justifyContent: "left",
                backgroundColor: "white",
                color: "black",
                minWidth: 80,
                minHeight: 40
              }}
              startIcon={<Play />}
              variant="contained">
              <Typography fontFamily="Poppins, sans-serif" color="black" fontWeight={500} fontSize={15}>
                Play
              </Typography>
            </Button>
            {myOwn && (
              <>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? "long-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={this.handleOnDotsClick}>
                  <DotsVertical style={{ color: "white" }} />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorOrigin={{
                    vertical: "center",
                    horizontal: "right"
                  }}
                  transformOrigin={{
                    vertical: "center",
                    horizontal: "left"
                  }}
                  MenuListProps={{
                    "aria-labelledby": "long-button"
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={this.handleClose}>
                  <MenuItem onClick={this.handleOnDelete}>
                    <Typography fontFamily="Poppins, sans-serif" color="red" fontWeight={500} fontSize={15}>
                      Delete Playlist
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const PlaylistTopComponent = React.memo<OuterProps>((props) => {
  const classes = usePlaylistStyles();
  const navigate = useNavigate();
  const [image, setImage] = React.useState<string>("");
  const { deezerToken } = useDeezerAuth();
  const { userId } = useUserContext();
  const { playlist, sourceType, spotifyApi } = props;

  if (sourceType === SourceType.Spotify) {
    const spotiPlaylist = playlist as SpotifyApi.PlaylistObjectSimplified;

    if (spotiPlaylist && spotiPlaylist.images.length === 0) {
      spotifyApi.getPlaylistTracks(spotiPlaylist.id).then((tracks) => {
        setImage(tracks.body.items[0].track.album.images[0].url);
      });
    }
  }

  return (
    <PlaylistComponentClass
      userId={userId}
      deezerToken={deezerToken}
      navigate={navigate}
      image={image}
      classes={classes}
      {...props}
    />
  );
});
