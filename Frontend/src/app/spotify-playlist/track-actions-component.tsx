import * as React from "react";
import CardsHeart from "mdi-material-ui/CardsHeart";
import CardsHeartOutline from "mdi-material-ui/CardsHeartOutline";
import SpotifyWebApi from "spotify-web-api-node";
import { IconButton, IconButtonProps } from "@mui/material";
import { SourceType } from "./playlist-component";
import { PlaylistApi } from "../../api/api-endpoints";
import { useUserContext } from "../../context/user-context";
import { PlaylistsDialogComponent } from "./playlists-dialog/playlists-dialog-component";
import { Album, TrackListData } from "../../types/deezer.types";

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

interface OuterProps {
  myOwn?: boolean;
  sourceType: SourceType;
  spotifyApi: SpotifyWebApi;
  trackName: string;
  playlist: SpotifyApi.PlaylistObjectSimplified | gapi.client.youtube.Playlist | PlaylistType | Album;
  imageUrl: string;
  artists?: string;
  deezerTrack?: TrackListData;
}

interface InnerProps {
  userId?: string;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dialogOpen: boolean;
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

    const { spotifyApi, playlist, trackName, sourceType, userId, deezerTrack } = this.props;
    const { TracksApiEndpoints } = PlaylistApi;
    const { isMine } = this.state;

    if (isMine) {
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
        }
      }
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

    return (
      <>
        <IconButton onClick={this.handleOnIconClick} style={{ padding: 0, color: "rgba(255, 255, 255, .7)" }}>
          {isMine ? (
            <CardsHeart id="DotsSvgIcon" style={{ display: "none", color: "red" }} />
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
            artists={artists}
            deezerTrack={deezerTrack}
          />
        )}
      </>
    );
  }
}

export const TrackActionComponent = React.memo<OuterProps>((props) => {
  const { userId } = useUserContext();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return <TrackActionComponentClass dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} userId={userId} {...props} />;
});
