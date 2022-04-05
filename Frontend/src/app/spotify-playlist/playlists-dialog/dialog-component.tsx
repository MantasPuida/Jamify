import * as React from "react";
import ChevronDown from "mdi-material-ui/ChevronDown";
import SpotifyWebApi from "spotify-web-api-node";
import { Accordion, AccordionSummary, AccordionDetails, Typography, FormGroup } from "@mui/material";
import { SpotifyPlaylistCheckbox } from "./spotify-playlist-checkbox";
import { YoutubePlaylistCheckbox } from "./youtube-playlist-checkbox";
import { SourceType } from "../playlist-component";
import { Album, TrackListData, PlaylistsResponseMe, PlaylistsResponse } from "../../../types/deezer.types";
import { DeezerPlaylistCheckbox } from "./deezer-playlist-checkbox";
import { PlaylistApi } from "../../../api/api-endpoints";
import { useUserContext } from "../../../context/user-context";
import { MyOwnPlaylistCheckbox } from "./my-own-playlist-checkbox";

interface PlaylistType {
  playlistId: string;
  playlistName: string;
  playlistImage: string;
  playlistDescription: string;
}

type DeezerPlaylistType = Album | PlaylistsResponse;

interface OuterProps {
  spotifyPlaylists?: SpotifyApi.ListOfUsersPlaylistsResponse;
  youtubePlaylists?: gapi.client.youtube.PlaylistListResponse;
  deezerPlaylists?: PlaylistsResponseMe;
  trackName: string;
  imageUrl: string;
  spotifyApi: SpotifyWebApi;
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
  ownPlaylists: PlaylistType[] | undefined;
}

type Props = OuterProps & InnerProps;

interface State {
  expanded: string | false;
}

class DialogContentDialogClass extends React.PureComponent<Props, State> {
  public state: State = { expanded: false };

  private handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({ expanded: isExpanded ? panel : false });
  };

  public render(): React.ReactNode {
    const {
      spotifyPlaylists,
      youtubePlaylists,
      trackName,
      imageUrl,
      spotifyApi,
      currentPlaylist,
      sourceType,
      artists,
      deezerPlaylists,
      deezerTrack,
      ownPlaylists
    } = this.props;
    const { expanded } = this.state;

    return (
      <>
        {spotifyPlaylists && (
          <Accordion
            expanded={expanded === "spotify"}
            onChange={this.handleChange("spotify")}
            style={{ minWidth: 250 }}>
            <AccordionSummary expandIcon={<ChevronDown />} aria-controls="spotifybh-content" id="spotifybh-header">
              <Typography style={{ float: "left", flexShrink: 0, width: "80%" }}>Spotify Playlist</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ maxHeight: 260, overflow: "auto" }}>
              <FormGroup>
                {spotifyPlaylists.items.map((playlist) => (
                  <SpotifyPlaylistCheckbox
                    playlist={playlist}
                    trackName={trackName}
                    spotifyApi={spotifyApi}
                    imageUrl={imageUrl}
                    currentPlaylist={currentPlaylist}
                    sourceType={sourceType}
                    key={playlist.id}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        )}
        {youtubePlaylists && (
          <Accordion expanded={expanded === "youtube"} onChange={this.handleChange("youtube")}>
            <AccordionSummary expandIcon={<ChevronDown />} aria-controls="youtubebh-content" id="youtubebh-header">
              <Typography style={{ float: "left", flexShrink: 0, width: "80%" }}>Youtube Playlist</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ maxHeight: 260, overflow: "auto" }}>
              <FormGroup>
                {youtubePlaylists.items?.map((playlist) => (
                  <YoutubePlaylistCheckbox
                    playlist={playlist}
                    trackName={trackName}
                    imageUrl={imageUrl}
                    currentPlaylist={currentPlaylist}
                    sourceType={sourceType}
                    key={playlist.id}
                    artists={artists}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        )}
        {deezerPlaylists && (
          <Accordion expanded={expanded === "deezer"} onChange={this.handleChange("deezer")}>
            <AccordionSummary expandIcon={<ChevronDown />} aria-controls="deezerbh-content" id="deezerbh-header">
              <Typography style={{ float: "left", flexShrink: 0, width: "80%" }}>Deezer Playlist</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ maxHeight: 260, overflow: "auto" }}>
              <FormGroup>
                {deezerPlaylists.data.map((playlist) => (
                  <DeezerPlaylistCheckbox
                    playlist={playlist}
                    trackName={trackName}
                    imageUrl={imageUrl}
                    currentPlaylist={currentPlaylist}
                    sourceType={sourceType}
                    deezerTrack={deezerTrack}
                    artists={artists}
                    key={playlist.id}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        )}
        {ownPlaylists && (
          <Accordion expanded={expanded === "own"} onChange={this.handleChange("own")}>
            <AccordionSummary expandIcon={<ChevronDown />} aria-controls="ownbh-content" id="ownbh-header">
              <Typography style={{ float: "left", flexShrink: 0, width: "80%" }}>Universal Playlist</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ maxHeight: 260, overflow: "auto" }}>
              <FormGroup>
                {ownPlaylists.map((playlist) => (
                  <MyOwnPlaylistCheckbox
                    playlist={playlist}
                    trackName={trackName}
                    imageUrl={imageUrl}
                    currentPlaylist={currentPlaylist}
                    sourceType={sourceType}
                    artists={artists}
                    key={playlist.playlistId}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        )}
      </>
    );
  }
}

// eslint-disable-next-line arrow-body-style
export const DialogContentDialog = React.memo<OuterProps>((props) => {
  const [ownPlaylists, setOwnPlaylists] = React.useState<PlaylistType[]>();
  const { userId } = useUserContext();
  const { PlaylistApiEndpoints } = PlaylistApi;

  if (userId) {
    PlaylistApiEndpoints()
      .fetchPlaylists(userId)
      .then((playlists) => {
        setOwnPlaylists(playlists.data as PlaylistType[]);
      });
  }

  return <DialogContentDialogClass ownPlaylists={ownPlaylists} {...props} />;
});
