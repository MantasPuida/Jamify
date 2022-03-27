import * as React from "react";
import ChevronDown from "mdi-material-ui/ChevronDown";
import Spotify from "mdi-material-ui/Spotify";
import PlayCircleOutline from "mdi-material-ui/PlayCircleOutline";
import SpotifyWebApi from "spotify-web-api-node";
import { Accordion, AccordionSummary, AccordionDetails, Typography, FormGroup } from "@mui/material";
import { SpotifyPlaylistCheckbox } from "./spotify-playlist-checkbox";
import { YoutubePlaylistCheckbox } from "./youtube-playlist-checkbox";
import { SourceType } from "../playlist-component";

interface PlaylistType {
  playlistId: string;
  playlistName: string;
  playlistImage: string;
  playlistDescription: string;
}

interface OuterProps {
  spotifyPlaylists?: SpotifyApi.ListOfUsersPlaylistsResponse;
  youtubePlaylists?: gapi.client.youtube.PlaylistListResponse;
  trackName: string;
  imageUrl: string;
  spotifyApi: SpotifyWebApi;
  sourceType: SourceType;
  currentPlaylist: SpotifyApi.PlaylistObjectSimplified | gapi.client.youtube.Playlist | PlaylistType;
}

interface State {
  expanded: string | false;
}

class DialogContentDialogClass extends React.PureComponent<OuterProps, State> {
  public state: State = { expanded: false };

  private handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({ expanded: isExpanded ? panel : false });
  };

  public render(): React.ReactNode {
    const { spotifyPlaylists, youtubePlaylists, trackName, imageUrl, spotifyApi, currentPlaylist, sourceType } =
      this.props;
    const { expanded } = this.state;

    return (
      <>
        <Accordion expanded={expanded === "spotify"} onChange={this.handleChange("spotify")} style={{ minWidth: 250 }}>
          <AccordionSummary expandIcon={<ChevronDown />} aria-controls="spotifybh-content" id="spotifybh-header">
            <Typography style={{ float: "left", flexShrink: 0, width: "80%" }}>Spotify Playlist</Typography>
            <Spotify style={{ paddingLeft: 8, color: "#1DB954" }} />
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {spotifyPlaylists &&
                spotifyPlaylists.items.map((playlist) => (
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
        <Accordion expanded={expanded === "youtube"} onChange={this.handleChange("youtube")}>
          <AccordionSummary expandIcon={<ChevronDown />} aria-controls="youtubebh-content" id="youtubebh-header">
            <Typography style={{ float: "left", flexShrink: 0, width: "80%" }}>Youtube Playlist</Typography>
            <PlayCircleOutline style={{ paddingLeft: 8, color: "#FF0000" }} />
          </AccordionSummary>
          <AccordionDetails style={{ maxHeight: 260, overflow: "hidden", overflowY: "scroll" }}>
            <FormGroup>
              {youtubePlaylists &&
                youtubePlaylists.items?.map((playlist) => (
                  <YoutubePlaylistCheckbox
                    playlist={playlist}
                    trackName={trackName}
                    imageUrl={imageUrl}
                    currentPlaylist={currentPlaylist}
                    sourceType={sourceType}
                    key={playlist.id}
                  />
                ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      </>
    );
  }
}

// eslint-disable-next-line arrow-body-style
export const DialogContentDialog = React.memo<OuterProps>((props) => {
  return <DialogContentDialogClass {...props} />;
});
