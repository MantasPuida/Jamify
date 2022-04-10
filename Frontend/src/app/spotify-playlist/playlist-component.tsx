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
import { Album, PlaylistsResponse, ArtistAlbumsResponse, PlaylistTracksResponse } from "../../types/deezer.types";
import { Notify } from "../notification/notification-component";
import { AppRoutes } from "../routes/routes";
import { useDeezerAuth } from "../../context/deezer-context";
import { PlaylistApi } from "../../api/api-endpoints";
import { useUserContext } from "../../context/user-context";

import "./fontFamily.css";
import { usePlayerContext } from "../../context/player-context";

export enum SourceType {
  Spotify,
  Youtube,
  Own,
  Deezer
}

interface TrackType {
  trackId: string;
  trackName: string;
  imageUrl: string;
  artists: string;
  duration: string;
  album: string;
}

type SpotifyPlaylistTracksResponse = SpotifyApi.PlaylistTrackResponse;
type DeezerPlaylistType = Album | PlaylistsResponse;
type PlaylistTracksType =
  | SpotifyPlaylistTracksResponse
  | gapi.client.youtube.PlaylistItemListResponse
  | TrackType[]
  | ArtistAlbumsResponse
  | PlaylistTracksResponse;

interface OuterProps {
  playlist: SpotifyApi.PlaylistObjectSimplified | gapi.client.youtube.Playlist | PlaylistType | DeezerPlaylistType;
  sourceType: SourceType;
  spotifyApi: SpotifyWebApi;
  myOwn?: boolean;
  playlistTracks: PlaylistTracksType;
}

interface QueueType {
  queue: PlaylistTracksType | undefined;
  source: "spotify" | "youtube" | "deezer" | "own";
}

interface InnerProps extends WithStyles<typeof PlaylistStyles> {
  image: string;
  navigate: NavigateFunction;
  deezerToken: string | null;
  userId?: string;
  setQueue: React.Dispatch<React.SetStateAction<QueueType | undefined>>;
  queue: QueueType | undefined;
  setTrack: Function;
  setOpen: Function;
  isOpen: boolean;
}

interface TrackObject {
  title: string;
  thumbnail: string;
  channelTitle: string;
  videoId: string;
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

    const { playlistTracks, queue, setQueue, sourceType, isOpen, setOpen, setTrack, playlist, spotifyApi, userId } =
      this.props;

    let sourceOfTracks: "spotify" | "youtube" | "deezer" | "own" = "own";
    if (sourceType === SourceType.Spotify) {
      sourceOfTracks = "spotify";
    } else if (sourceType === SourceType.Youtube) {
      sourceOfTracks = "youtube";
    } else if (sourceType === SourceType.Deezer) {
      sourceOfTracks = "deezer";
    }

    if (queue !== playlistTracks) {
      setQueue({
        queue: playlistTracks,
        source: sourceOfTracks
      });
    }

    if (sourceType === SourceType.Spotify) {
      const currentPlaylist = playlist as SpotifyApi.PlaylistObjectSimplified;

      spotifyApi.getPlaylistTracks(currentPlaylist.id).then((response) => {
        const responseData = response.body;

        gapi.client.youtube.search
          .list({
            part: "snippet",
            q: `${responseData.items[0].track.name} ${responseData.items[0].track.artists[0].name}`
          })
          .then((value) => {
            if (value.result.items && value.result.items[0].id?.videoId) {
              const currentTrack: TrackObject = {
                videoId: value.result.items[0].id.videoId,
                title: responseData.items[0].track.name,
                thumbnail: responseData.items[0].track.album.images[0].url,
                channelTitle: currentPlaylist.name
              };

              if (!isOpen) {
                setOpen(true);
              }
              setTrack(currentTrack);
            }
          });
      });
    } else if (sourceType === SourceType.Youtube) {
      const currentPlaylist = playlist as gapi.client.youtube.Playlist;

      gapi.client.youtube.playlistItems
        .list({
          part: "snippet",
          playlistId: currentPlaylist.id
        })
        .then((value) => {
          const { items } = value.result;

          if (
            items &&
            items[0].snippet?.resourceId?.videoId &&
            items[0].snippet.title &&
            currentPlaylist?.snippet?.channelTitle
          ) {
            const imageUrl = extractThumbnail(items[0]?.snippet?.thumbnails);

            const currentTrack: TrackObject = {
              videoId: items[0].snippet.resourceId.videoId,
              title: items[0].snippet.title,
              thumbnail: imageUrl ?? "",
              channelTitle: currentPlaylist.snippet.channelTitle
            };

            if (!isOpen) {
              setOpen(true);
            }

            setTrack(currentTrack);
          }
        });
    } else if (sourceType === SourceType.Deezer) {
      const currentPlaylist = playlist as DeezerPlaylistType;

      if (currentPlaylist.type === "album") {
        const currentAlbum = playlist as Album;

        DZ.api(`album/${currentAlbum.id}/tracks`, (response) => {
          const data = response as ArtistAlbumsResponse;
          const firstRecord = data.data[0];

          gapi.client.youtube.search
            .list({
              part: "snippet",
              q: `${firstRecord.title} ${firstRecord.artist.name ?? ""}`
            })
            .then((value) => {
              if (value.result.items && value.result.items[0].id?.videoId) {
                const currentTrack: TrackObject = {
                  videoId: value.result.items[0].id.videoId,
                  title: firstRecord.title_short ?? "",
                  thumbnail: firstRecord.cover_xl ?? "",
                  channelTitle: currentPlaylist.title ?? ""
                };

                if (!isOpen) {
                  setOpen(true);
                }
                setTrack(currentTrack);
              }
            });
        });
      } else if (currentPlaylist.type === "playlist") {
        const currentDzPlaylist = playlist as PlaylistsResponse;

        DZ.api(`playlist/${currentDzPlaylist.id}/tracks`, (response) => {
          const data = response as PlaylistTracksResponse;
          const firstRecord = data.data[0];

          gapi.client.youtube.search
            .list({
              part: "snippet",
              q: `${firstRecord.title ?? ""} ${firstRecord.artist.name ?? ""}`
            })
            .then((value) => {
              if (value.result.items && value.result.items[0].id?.videoId) {
                const currentTrack: TrackObject = {
                  videoId: value.result.items[0].id.videoId,
                  title: firstRecord.title ?? "",
                  thumbnail: firstRecord.album.cover_xl ?? "",
                  channelTitle: currentPlaylist.title ?? ""
                };

                if (!isOpen) {
                  setOpen(true);
                }
                setTrack(currentTrack);
              }
            });
        });
      }
    } else if (sourceType === SourceType.Own && userId) {
      const currentPlaylist = playlist as PlaylistType;

      const { TracksApiEndpoints } = PlaylistApi;

      TracksApiEndpoints()
        .fetchTracks(userId, currentPlaylist.playlistId)
        .then((response) => {
          const track = response.data[0] as TrackType;

          gapi.client.youtube.search
            .list({
              part: "snippet",
              q: `${track.trackName} ${track.artists ?? ""}`
            })
            .then((value) => {
              if (value.result.items && value.result.items[0].id?.videoId) {
                const currentTrack: TrackObject = {
                  videoId: value.result.items[0].id.videoId,
                  title: track.trackName ?? "",
                  thumbnail: track.imageUrl ?? "",
                  channelTitle: track.artists ?? ""
                };

                if (!isOpen) {
                  setOpen(true);
                }
                setTrack(currentTrack);
              }
            });
        });
    }
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
  const { setQueue, queue, setTrack, setOpen, isOpen } = usePlayerContext();
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
      classes={classes}
      navigate={navigate}
      image={image}
      deezerToken={deezerToken}
      userId={userId}
      isOpen={isOpen}
      setOpen={setOpen}
      setTrack={setTrack}
      setQueue={setQueue}
      queue={queue}
      {...props}
    />
  );
});
