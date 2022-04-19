import * as React from "react";
import CardsHeart from "mdi-material-ui/CardsHeart";
import CardsHeartOutline from "mdi-material-ui/CardsHeartOutline";
import SpotifyWebApi from "spotify-web-api-node";
import { IconButton, IconButtonProps } from "@mui/material";
import { SourceType } from "./playlist-component";
import { PlaylistApi } from "../../api/api-endpoints";
import { useUserContext } from "../../context/user-context";
import { PlaylistsDialogComponent } from "./playlists-dialog/playlists-dialog-component";
import { Album, TrackListData, OmittedPlaylistResponse } from "../../types/deezer.types";
import { useDeezerAuth } from "../../context/deezer-context";
import { useAppContext } from "../../context/app-context";

interface PlaylistType {
  playlistId: string;
  playlistName: string;
  playlistImage: string;
  playlistDescription: string;
}

interface TrackType {
  trackId: string;
  trackName: string;
  imageUrl: string;
  trackDescription: string;
  trackSource: string;
}

type DeezerPlaylistType = Album | OmittedPlaylistResponse;

interface OuterProps {
  myOwn?: boolean;
  sourceType: SourceType;
  spotifyApi: SpotifyWebApi;
  trackName: string;
  playlist: SpotifyApi.PlaylistObjectSimplified | gapi.client.youtube.Playlist | PlaylistType | DeezerPlaylistType;
  imageUrl: string;
  artists?: string | string[];
  deezerTrack?: TrackListData;
}

interface InnerProps {
  userId?: string;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dialogOpen: boolean;
  deezerToken: string | null;
  setLoading: Function;
}

type Props = OuterProps & InnerProps;

interface State {
  isMine: boolean;
}

class TrackActionComponentClass extends React.PureComponent<Props, State> {
  public state: State;

  constructor(props: Props) {
    super(props);

    const { myOwn } = props;

    this.state = {
      isMine: Boolean(myOwn)
    };
  }

  private handleOnIconClick: IconButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { spotifyApi, playlist, trackName, sourceType, userId, deezerTrack, deezerToken, setLoading } = this.props;
    const { TracksApiEndpoints } = PlaylistApi;
    const { isMine } = this.state;

    if (isMine) {
      setLoading(true);
      if (sourceType === SourceType.Youtube) {
        const youtubePlaylist = playlist as gapi.client.youtube.Playlist;

        gapi.client.youtube.playlistItems
          .list({
            part: "snippet",
            playlistId: youtubePlaylist.id,
            maxResults: 99
          })
          .then((itemsData) => {
            const items = itemsData.result;

            const currentTrack = items.items?.filter((value) => value.snippet?.title?.includes(trackName));
            if (!currentTrack || !currentTrack[0].id) {
              return;
            }

            gapi.client.youtube.playlistItems
              .delete({
                id: currentTrack[0].id
              })
              .then(() => {
                this.setState({ isMine: false });
              });
          });
      } else if (sourceType === SourceType.Spotify) {
        const spotifyPlaylist = playlist as SpotifyApi.PlaylistObjectSimplified;

        spotifyApi.getPlaylistTracks(spotifyPlaylist.id).then((tracksData) => {
          const tracks = tracksData.body;
          const track = tracks.items.filter((item) => item.track.name.includes(trackName));

          if (track && track.length > 0)
            spotifyApi
              .removeTracksFromPlaylist(spotifyPlaylist.id, [
                {
                  uri: track[0].track.uri
                }
              ])
              .then(() => {
                this.setState({ isMine: false });
              });
        });
      } else if (sourceType === SourceType.Own) {
        if (!userId) {
          return;
        }

        const ownPlaylist = playlist as PlaylistType;

        TracksApiEndpoints()
          .fetchTracks(userId, ownPlaylist.playlistId)
          .then((tracksData) => {
            const tracks = tracksData.data as TrackType[];

            const track = tracks.filter((value) => value.trackName.includes(trackName));

            if (track && track.length > 0) {
              TracksApiEndpoints()
                .deleteTrack(userId, ownPlaylist.playlistId, track[0].trackId)
                .then(() => {
                  this.setState({ isMine: false });
                });
            }
          });
      } else if (sourceType === SourceType.Deezer) {
        if (deezerTrack) {
          DZ.api(
            `playlist/${deezerTrack.album.id}/tracks`,
            "DELETE",
            {
              songs: [deezerTrack.id]
            },
            () => {
              this.setState({ isMine: false });
            }
          );
        } else {
          const deezerPlaylist = playlist as DeezerPlaylistType;

          if (deezerPlaylist.type === "playlist") {
            const currentPlaylist = deezerPlaylist as OmittedPlaylistResponse;
            DZ.api(`playlist/${currentPlaylist.id}/tracks`, (response) => {
              const removableTrack = response.data.filter((value) => value.title.includes(trackName));

              if (!removableTrack || !removableTrack[0].id || !deezerToken) {
                return;
              }

              DZ.api(
                `playlist/${currentPlaylist.id}/tracks?access_token=${deezerToken}`,
                "DELETE",
                {
                  songs: [removableTrack[0].id]
                },
                () => {
                  this.setState({ isMine: false });
                }
              );
            });
          }
        }
      }

      setLoading(false);
    } else {
      const { setDialogOpen } = this.props;

      setDialogOpen(true);
    }
  };

  public render(): React.ReactNode {
    const { isMine } = this.state;
    const {
      dialogOpen,
      setDialogOpen,
      spotifyApi,
      imageUrl,
      trackName,
      userId,
      playlist,
      sourceType,
      artists,
      deezerTrack
    } = this.props;

    let resolvedArtists = "";

    if (artists) {
      if (Array.isArray(artists)) {
        resolvedArtists = artists.join(", ");
      } else {
        resolvedArtists = artists;
      }
    }

    return (
      <>
        <IconButton onClick={this.handleOnIconClick} style={{ padding: 0, color: "rgba(255, 255, 255, .7)" }}>
          {isMine ? (
            <CardsHeart id="DotsSvgIcon" style={{ color: "red" }} />
          ) : (
            <CardsHeartOutline id="DotsSvgIcon" style={{ display: "none", color: "red" }} />
          )}
        </IconButton>
        {dialogOpen && (
          <PlaylistsDialogComponent
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            spotifyApi={spotifyApi}
            imageUrl={imageUrl}
            trackName={trackName}
            userId={userId}
            currentPlaylist={playlist}
            sourceType={sourceType}
            artists={resolvedArtists}
            deezerTrack={deezerTrack}
          />
        )}
      </>
    );
  }
}

export const TrackActionComponent = React.memo<OuterProps>((props) => {
  const { userId } = useUserContext();
  const { deezerToken } = useDeezerAuth();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { setLoading } = useAppContext();

  return (
    <TrackActionComponentClass
      deezerToken={deezerToken}
      dialogOpen={dialogOpen}
      setDialogOpen={setDialogOpen}
      userId={userId}
      setLoading={setLoading}
      {...props}
    />
  );
});
