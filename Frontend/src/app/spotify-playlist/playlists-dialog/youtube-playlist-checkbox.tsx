import { Checkbox, CheckboxProps, FormControlLabel, Grid } from "@mui/material";
import * as React from "react";
import { SourceType } from "../playlist-component";
import { Album, OmittedPlaylistResponse } from "../../../types/deezer.types";
import { Notify } from "../../notification/notification-component";

interface PlaylistType {
  playlistId: string;
  playlistName: string;
  playlistImage: string;
  playlistDescription: string;
}

type DeezerPlaylistType = Album | OmittedPlaylistResponse;

interface OuterProps {
  playlist: gapi.client.youtube.Playlist;
  trackName: string;
  imageUrl: string;
  sourceType: SourceType;
  currentPlaylist:
    | SpotifyApi.PlaylistObjectSimplified
    | gapi.client.youtube.Playlist
    | PlaylistType
    | DeezerPlaylistType;
  artists?: string;
}

interface State {
  foundTrack?: gapi.client.youtube.PlaylistItem;
}

class YoutubePlaylistCheckboxClass extends React.PureComponent<OuterProps, State> {
  public state: State = {};

  private handleOnChange: CheckboxProps["onChange"] = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const isChecked = event.currentTarget.checked;

    const { trackName, playlist, currentPlaylist, sourceType, artists } = this.props;

    if (sourceType === SourceType.Youtube) {
      const currPlaylist = currentPlaylist as gapi.client.youtube.Playlist;

      gapi.client.youtube.playlistItems
        .list({ part: "snippet", playlistId: currPlaylist.id, maxResults: 999 })
        .then((tracksData) => {
          const tracks = tracksData.result;

          const foundTrack = tracks.items?.filter((value) => value.snippet?.title?.includes(trackName));
          if (!foundTrack || foundTrack.length === 0) {
            gapi.client.youtube.playlistItems
              .list({ part: "snippet", playlistId: currPlaylist.id, maxResults: 999, pageToken: tracks.nextPageToken })
              .then((nextPage) => {
                const nextPageTracks = nextPage.result;

                const nextPageTrack = nextPageTracks.items?.filter((value) =>
                  value.snippet?.title?.includes(trackName)
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
            if (isChecked) {
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
                  Notify("Track has been added.", "success");
                })
                .catch((err) => {
                  Notify(err, "error");
                });
            } else if (!isChecked) {
              if (myTrack[0].id) {
                gapi.client.youtube.playlistItems
                  .list({ part: "snippet", playlistId: playlist.id, maxResults: 999 })
                  .then((valueData) => {
                    const playlistItems = valueData.result;

                    const track = playlistItems.items?.filter((value) => value.snippet?.title?.includes(trackName));

                    if (track && track.length > 0 && track[0].id) {
                      gapi.client.youtube.playlistItems.delete({ id: track[0].id });
                    }
                  })
                  .then(() => {
                    Notify("Track has been removed", "success");
                  })
                  .catch((err) => {
                    Notify(err, "error");
                  });
              }
            }
          }
        });
    } else {
      let query = trackName;
      if (artists) {
        query += ` ${artists}`;
      }

      gapi.client.youtube.search.list({ part: "snippet", q: query, maxResults: 1 }).then((tracksData) => {
        const { items } = tracksData.result;

        const resolvedItem = items?.filter((value) => value.id?.videoId !== undefined);

        if (resolvedItem && resolvedItem.length > 0 && resolvedItem[0].id?.videoId) {
          if (isChecked) {
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
                Notify("Track has been added.", "success");
              })
              .catch((err) => {
                Notify(err, "error");
              });
          } else if (!isChecked) {
            gapi.client.youtube.playlistItems
              .list({ part: "snippet", playlistId: playlist.id, maxResults: 999 })
              .then((valueData) => {
                const playlistItemsDelete = valueData.result;

                const playlistTrack = playlistItemsDelete.items?.filter((value) =>
                  value.snippet?.title?.includes(trackName)
                );

                if (playlistTrack && playlistTrack.length > 0 && playlistTrack[0].id) {
                  gapi.client.youtube.playlistItems.delete({ id: playlistTrack[0].id });
                }
              })
              .then(() => {
                Notify("Track has been removed", "success");
              })
              .catch((err) => {
                Notify(err, "error");
              });
          }
        }
      });
    }
  };

  public render(): React.ReactNode {
    const { playlist } = this.props;

    if (!playlist.snippet || !playlist.snippet.title) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    return (
      <Grid container={true}>
        <Grid item={true} xs={12}>
          <FormControlLabel control={<Checkbox onChange={this.handleOnChange} />} label={playlist.snippet.title} />
        </Grid>
      </Grid>
    );
  }
}

// eslint-disable-next-line arrow-body-style
export const YoutubePlaylistCheckbox = React.memo<OuterProps>((props) => {
  return <YoutubePlaylistCheckboxClass {...props} />;
});
