import * as React from "react";
import ChevronDown from "mdi-material-ui/ChevronDown";
import Spotify from "mdi-material-ui/Spotify";
import PlayCircleOutline from "mdi-material-ui/PlayCircleOutline";
import SpotifyWebApi from "spotify-web-api-node";
import { Accordion, AccordionSummary, AccordionDetails, Typography, FormGroup, Avatar, Grid } from "@mui/material";
import { SpotifyPlaylistCheckbox } from "./spotify-playlist-checkbox";
import { YoutubePlaylistCheckbox } from "./youtube-playlist-checkbox";
import { SourceType } from "../playlist-component";
import { Album, TrackListData, PlaylistsResponseMe } from "../../../types/deezer.types";
import { DeezerPlaylistCheckbox } from "./deezer-playlist-checkbox";
import DeezerLogo from "../../../assets/svg/deezer-logo.svg";

interface PlaylistType {
  playlistId: string;
  playlistName: string;
  playlistImage: string;
  playlistDescription: string;
}

interface OuterProps {
  spotifyPlaylists?: SpotifyApi.ListOfUsersPlaylistsResponse;
  youtubePlaylists?: gapi.client.youtube.PlaylistListResponse;
  deezerPlaylists?: PlaylistsResponseMe;
  trackName: string;
  imageUrl: string;
  spotifyApi: SpotifyWebApi;
  sourceType: SourceType;
  currentPlaylist: SpotifyApi.PlaylistObjectSimplified | gapi.client.youtube.Playlist | PlaylistType | Album;
  artists?: string;
  deezerTrack?: TrackListData;
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
      deezerTrack
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
              <Grid container={true}>
                <Grid item={true} xs={10}>
                  <Typography style={{ float: "left", flexShrink: 0, width: "80%" }}>Spotify Playlist</Typography>
                </Grid>
                <Grid item={true} xs={2}>
                  <Spotify style={{ paddingLeft: 8, color: "#1DB954" }} />
                </Grid>
              </Grid>
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
              <PlayCircleOutline style={{ paddingLeft: 8, color: "#FF0000" }} />
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
              <Grid container={true}>
                <Grid item={true} xs={10}>
                  <Typography style={{ float: "left", flexShrink: 0, width: "80%" }}>Deezer Playlist</Typography>
                </Grid>
                <Grid item={true} xs={2}>
                  <Avatar
                    src={DeezerLogo}
                    style={{ width: "20px", height: "20px", marginLeft: 8, border: "1px solid black" }}
                  />
                </Grid>
              </Grid>
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
      </>
    );
  }
}

// eslint-disable-next-line arrow-body-style
export const DialogContentDialog = React.memo<OuterProps>((props) => {
  return <DialogContentDialogClass {...props} />;
});
