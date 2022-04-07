import * as React from "react";
import {
  Dialog,
  DialogProps,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Button,
  ButtonProps,
  Grid,
  TextField,
  TextFieldProps,
  ToggleButtonGroup,
  ToggleButton,
  ToggleButtonGroupProps,
  Typography
} from "@mui/material";
import SpotifyWebApi from "spotify-web-api-node";
import Plus from "mdi-material-ui/Plus";
import { useLocation } from "react-router";
import { useSpotifyAuth } from "../../../context/spotify-context";
import { useYoutubeAuth } from "../../../context/youtube-context";
import { DialogContentDialog } from "./dialog-component";
import { PlaylistApi } from "../../../api/api-endpoints";
import { SourceType } from "../playlist-component";
import { Album, PlaylistsResponseMe, TrackListData, PlaylistsResponse, Tracks } from "../../../types/deezer.types";
import { useDeezerAuth } from "../../../context/deezer-context";

import "../fontFamily.css";
import { Notify } from "../../notification/notification-component";

interface PlaylistType {
  playlistId: string;
  playlistName: string;
  playlistImage: string;
  playlistDescription: string;
}

type DeezerPlaylistType = Album | PlaylistsResponse;

interface OuterProps {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  spotifyApi: SpotifyWebApi;
  imageUrl: string;
  trackName: string;
  userId?: string;
  sourceType: SourceType;
  currentPlaylist:
    | SpotifyApi.PlaylistObjectSimplified
    | gapi.client.youtube.Playlist
    | PlaylistType
    | DeezerPlaylistType;
  artists?: string;
  deezerTrack?: TrackListData;
}

interface InnerProps {
  fullScreen: boolean;
  deezerPlaylists?: PlaylistsResponseMe;
  spotifyPlaylists?: SpotifyApi.ListOfUsersPlaylistsResponse;
  youtubePlaylists?: gapi.client.youtube.PlaylistListResponse;
  deezerToken: string | null;
}

interface State {
  isClicked: boolean;
  text: string;
  alignment: string;
  foundTrack?: gapi.client.youtube.PlaylistItem;
}

interface PlaylistReturnType {
  playlistId: string;
  playlistName: string;
  playlistImage: string;
  playlistDescription: string;
}

type Props = OuterProps & InnerProps;

class PlaylistsDialogComponentClass extends React.PureComponent<Props, State> {
  public state: State = { isClicked: false, text: "", alignment: "left" };

  private onDialogClose: DialogProps["onClose"] = () => {
    const { setDialogOpen } = this.props;

    setDialogOpen(false);
  };

  private handleClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({ isClicked: true });
  };

  private handleOnTextChange: TextFieldProps["onChange"] = (event) => {
    event.stopPropagation();
    event.preventDefault();

    this.setState({ text: event.currentTarget.value });
  };

  private postOwnPlaylist = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    const { text } = this.state;
    const { userId, imageUrl, trackName: songName } = this.props;

    if (!userId || text.length < 1) {
      return;
    }

    const { PlaylistApiEndpoints, TracksApiEndpoints } = PlaylistApi;

    PlaylistApiEndpoints()
      .postPlaylist(userId, {
        PlaylistName: text,
        PlaylistDescription: "",
        PlaylistImage: imageUrl
      })
      .then((playlistData) => {
        const playlist = playlistData.data as PlaylistReturnType;

        TracksApiEndpoints()
          .postTrack(userId, playlist.playlistId, {
            ImageUrl: imageUrl,
            TrackDescription: "",
            TrackName: songName,
            TrackSource: "Spotify"
          })
          .then(() => {
            if (this.onDialogClose) {
              this.onDialogClose(event, "backdropClick");
            }

            Notify("Playlist has been created", "success");
          });
      });
  };

  private postSpotifyPlaylist = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    const { text } = this.state;
    const { trackName: songName, spotifyApi, sourceType, currentPlaylist } = this.props;

    spotifyApi.createPlaylist(text).then((createdPlaylistData) => {
      const createdPlaylist = createdPlaylistData.body;
      if (sourceType === SourceType.Spotify) {
        const currPlaylist = currentPlaylist as SpotifyApi.PlaylistObjectSimplified;

        spotifyApi.getPlaylistTracks(currPlaylist.id).then((tracksData) => {
          const tracks = tracksData.body;

          const foundTrack = tracks.items.filter((value) => value.track.name.includes(songName));
          if (foundTrack && foundTrack.length > 0) {
            spotifyApi
              .addTracksToPlaylist(createdPlaylist.id, [foundTrack[0].track.uri])
              .then(() => {
                if (this.onDialogClose) {
                  this.onDialogClose(event, "backdropClick");
                }

                Notify("Playlist has been created", "success");
              })
              .catch((err) => {
                Notify(err, "error");
              });
          }
        });
      } else {
        spotifyApi.searchTracks(songName).then((tracksData) => {
          const { tracks } = tracksData.body;

          if (tracks && tracks.items.length > 0) {
            spotifyApi
              .addTracksToPlaylist(createdPlaylist.id, [tracks.items[0].uri])
              .then(() => {
                if (this.onDialogClose) {
                  this.onDialogClose(event, "backdropClick");
                }

                Notify("Playlist has been created", "success");
              })
              .catch((err) => {
                Notify(err, "error");
              });
          }
        });
      }
    });
  };

  private postYoutubePlaylist = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    const { text } = this.state;
    const { trackName: songName, sourceType, currentPlaylist, artists } = this.props;

    if (sourceType === SourceType.Youtube) {
      const currPlaylist = currentPlaylist as gapi.client.youtube.Playlist;

      gapi.client.youtube.playlists
        .insert({
          part: "snippet",
          resource: {
            snippet: {
              title: text
            }
          }
        })
        .then((playlistData) => {
          const playlist = playlistData.result;

          gapi.client.youtube.playlistItems
            .list({ part: "snippet", playlistId: currPlaylist.id, maxResults: 999 })
            .then((tracksData) => {
              const tracks = tracksData.result;

              const foundTrack = tracks.items?.filter((value) => value.snippet?.title?.includes(songName));
              if (!foundTrack || foundTrack.length === 0) {
                gapi.client.youtube.playlistItems
                  .list({
                    part: "snippet",
                    playlistId: currPlaylist.id,
                    maxResults: 999,
                    pageToken: tracks.nextPageToken
                  })
                  .then((nextPage) => {
                    const nextPageTracks = nextPage.result;

                    const nextPageTrack = nextPageTracks.items?.filter((value) =>
                      value.snippet?.title?.includes(songName)
                    );

                    if (nextPageTrack && nextPageTrack.length > 0) {
                      this.setState({ foundTrack: nextPageTrack[0] });
                    }
                  });
              } else {
                this.setState({ foundTrack: foundTrack[0] });
              }

              const { foundTrack: myTrack } = this.state;

              if (myTrack) {
                gapi.client.youtube.playlistItems
                  .insert({
                    part: "snippet",
                    resource: {
                      ...myTrack[0],
                      snippet: {
                        playlistId: playlist.id
                      }
                    }
                  })
                  .then(() => {
                    if (this.onDialogClose) {
                      this.onDialogClose(event, "backdropClick");
                    }

                    Notify("Playlist has been created", "success");
                  })
                  .catch((err) => {
                    Notify(err, "error");
                  });
              }
            });
        });
    } else {
      gapi.client.youtube.playlists
        .insert({
          part: "snippet",
          resource: {
            snippet: {
              title: text
            }
          }
        })
        .then((playlistData) => {
          const playlist = playlistData.result;

          let query = songName;
          if (artists) {
            query += ` ${artists}`;
          }

          gapi.client.youtube.search.list({ part: "snippet", q: query, maxResults: 1 }).then((tracksData) => {
            const { items } = tracksData.result;

            const resolvedItem = items?.filter((value) => value.id?.videoId !== undefined);

            if (resolvedItem && resolvedItem.length > 0 && resolvedItem[0].id?.videoId) {
              gapi.client.youtube.playlistItems
                .insert({
                  part: "snippet",
                  resource: {
                    snippet: {
                      playlistId: playlist.id,
                      resourceId: {
                        videoId: resolvedItem[0].id.videoId,
                        channelId: resolvedItem[0].id.channelId ?? resolvedItem[0].snippet?.channelId,
                        kind: resolvedItem[0].id.kind,
                        playlistId: resolvedItem[0].id.playlistId
                      }
                    }
                  }
                })
                .then(() => {
                  if (this.onDialogClose) {
                    this.onDialogClose(event, "backdropClick");
                  }

                  Notify("Playlist has been created", "success");
                })
                .catch((err) => {
                  Notify(err, "error");
                });
            }
          });
        });
    }
  };

  private postDeezerPlaylist = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    const { deezerTrack, deezerToken, trackName, sourceType, artists } = this.props;
    const { text } = this.state;
    if (sourceType === SourceType.Deezer) {
      if (deezerToken) {
        DZ.api(
          "user/me/playlists",
          "POST",
          {
            title: text
          },
          (playlist) => {
            DZ.api(
              `playlist/${playlist.id}/tracks?access_token=${deezerToken}`,
              "POST",
              {
                songs: [deezerTrack?.id]
              },
              (callback) => {
                if (callback.error) {
                  Notify(callback.error.message, "error");
                } else {
                  if (this.onDialogClose) {
                    this.onDialogClose(event, "backdropClick");
                  }

                  Notify("Playlist has been created", "success");
                }
              }
            );
          }
        );
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      let artistsQ = "";
      if (artists) {
        artistsQ = artists;
      }
      DZ.api(
        "user/me/playlists",
        "POST",
        {
          title: text
        },
        (playlist) => {
          DZ.api(`search?q=${trackName} - ${artistsQ}?strict=on`, (responseData) => {
            const response = responseData as Tracks;
            let relevantTrack = response.data.filter(
              (track) => track.type === "track" && track.title.toLowerCase() === trackName.toLowerCase()
            );

            if (relevantTrack.length === 0) {
              relevantTrack = response.data.filter((track) => track.type === "track");
            }

            DZ.api(
              `playlist/${playlist.id}/tracks?access_token=${deezerToken}`,
              "POST",
              {
                songs: [relevantTrack[0].id]
              },
              (callback) => {
                if (callback.error) {
                  Notify(callback.error.message, "error");
                } else {
                  if (this.onDialogClose) {
                    this.onDialogClose(event, "backdropClick");
                  }

                  Notify("Playlist has been created", "success");
                }
              }
            );
          });
        }
      );
    }
  };

  private handleOnCreate: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { text, alignment } = this.state;

    if (text.length < 1) {
      Notify("Please enter a playlist name", "error");
    }

    if (alignment === "left") {
      this.postOwnPlaylist(event);
    } else if (alignment === "center" && text.length > 0) {
      this.postSpotifyPlaylist(event);
    } else if (alignment === "right" && text.length > 0) {
      this.postYoutubePlaylist(event);
    } else if (alignment === "justify") {
      this.postDeezerPlaylist(event);
    }
  };

  private handleAlignment: ToggleButtonGroupProps["onChange"] = (event, newAlignment) => {
    event.stopPropagation();
    event.preventDefault();

    this.setState({ alignment: newAlignment });
  };

  public render(): React.ReactNode {
    const {
      dialogOpen,
      fullScreen,
      spotifyPlaylists,
      youtubePlaylists,
      imageUrl,
      trackName,
      spotifyApi,
      currentPlaylist,
      sourceType,
      artists,
      deezerTrack,
      deezerPlaylists
    } = this.props;
    const { isClicked, alignment } = this.state;

    return (
      <Dialog fullScreen={fullScreen} open={dialogOpen} onClose={this.onDialogClose}>
        <DialogTitle style={{ borderBottom: "1px solid lightgrey", paddingBottom: 8 }}>Save to...</DialogTitle>
        <DialogContent style={{ paddingTop: 16, borderBottom: "1px solid lightgrey" }}>
          <DialogContentDialog
            spotifyPlaylists={spotifyPlaylists}
            youtubePlaylists={youtubePlaylists}
            spotifyApi={spotifyApi}
            imageUrl={imageUrl}
            trackName={trackName}
            currentPlaylist={currentPlaylist}
            sourceType={sourceType}
            artists={artists}
            deezerTrack={deezerTrack}
            deezerPlaylists={deezerPlaylists}
          />
        </DialogContent>
        <DialogActions>
          {!isClicked && (
            <Button style={{ width: "100%", color: "black" }} startIcon={<Plus />} onClick={this.handleClick}>
              Create new playlist.
            </Button>
          )}
          {isClicked && (
            <Grid container={true}>
              <Grid item={true} xs={12}>
                <TextField
                  style={{ width: "100%" }}
                  label="Playlist Name"
                  variant="standard"
                  onChange={this.handleOnTextChange}
                />
              </Grid>
              <Grid item={true} xs={12} style={{ textAlign: "center", maxWidth: 40, paddingTop: 16 }}>
                <ToggleButtonGroup
                  value={alignment}
                  style={{ color: "black" }}
                  exclusive={true}
                  onChange={this.handleAlignment}
                  sx={{
                    ".css-ueukts-MuiButtonBase-root-MuiToggleButton-root.Mui-selected": {
                      backgroundColor: "rgb(0 0 0 / 20%)"
                    }
                  }}
                  aria-label="text alignment">
                  <ToggleButton value="left" aria-label="left aligned" style={{ textTransform: "none", padding: 6 }}>
                    <Typography fontFamily="Poppins, sans-serif" fontWeight={400}>
                      Universal
                    </Typography>
                  </ToggleButton>
                  <ToggleButton value="center" style={{ textTransform: "none", padding: 6 }} aria-label="centered">
                    <Typography fontFamily="Poppins, sans-serif" fontWeight={400}>
                      Spotify
                    </Typography>
                  </ToggleButton>
                  <ToggleButton value="right" style={{ textTransform: "none", padding: 6 }} aria-label="right aligned">
                    <Typography fontFamily="Poppins, sans-serif" fontWeight={400}>
                      Youtube
                    </Typography>
                  </ToggleButton>
                  <ToggleButton value="justify" style={{ textTransform: "none", padding: 6 }} aria-label="justified">
                    <Typography fontFamily="Poppins, sans-serif" fontWeight={400}>
                      Deezer
                    </Typography>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item={true} xs={12} style={{ textAlign: "end", paddingTop: 16 }}>
                <Button onClick={this.handleOnCreate}>Create</Button>
              </Grid>
            </Grid>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

// eslint-disable-next-line arrow-body-style
export const PlaylistsDialogComponent = React.memo<OuterProps>((props) => {
  const [spotifyPlaylists, setSpotifyPlaylists] = React.useState<SpotifyApi.ListOfUsersPlaylistsResponse>();
  const [youtubePlaylists, setYoutubePlaylists] = React.useState<gapi.client.youtube.PlaylistListResponse>();
  const [deezerPlaylists, setDeezerPlaylists] = React.useState<PlaylistsResponseMe>();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const { spotifyApi } = props;
  const { spotifyToken } = useSpotifyAuth();
  const { youtubeToken } = useYoutubeAuth();
  const { deezerToken } = useDeezerAuth();

  React.useEffect(() => {
    if (spotifyToken) {
      spotifyApi.getUserPlaylists().then((data) => setSpotifyPlaylists(data.body));
    }

    if (youtubeToken) {
      gapi.client.youtube.playlists
        .list({ part: "snippet", mine: true, maxResults: 99 })
        .then((data) => setYoutubePlaylists(data.result));
    }

    if (deezerToken) {
      DZ.api(`user/me/playlists?access_token=${deezerToken}`, (response) => {
        setDeezerPlaylists(response);
      });
    }
  }, [location]);

  return (
    <PlaylistsDialogComponentClass
      spotifyPlaylists={spotifyPlaylists}
      youtubePlaylists={youtubePlaylists}
      deezerPlaylists={deezerPlaylists}
      deezerToken={deezerToken}
      fullScreen={fullScreen}
      {...props}
    />
  );
});
