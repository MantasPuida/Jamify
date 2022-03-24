import { Button, ButtonProps, Grid, Typography } from "@mui/material";
import * as React from "react";
import SpotifyWebApi from "spotify-web-api-node";

interface OuterProps {
  spotifyPlaylist: SpotifyApi.PlaylistObjectSimplified;
  spotifyApi: SpotifyWebApi;
  trackName: string;
  handleDialogClose: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

interface InnerProps {}

type Props = InnerProps & OuterProps;

class SpotifyPlaylistsMapClass extends React.PureComponent<Props> {
  private handleTrackAdd: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { spotifyApi, spotifyPlaylist, trackName, handleDialogClose } = this.props;

    if (!handleDialogClose) {
      return;
    }

    spotifyApi.searchTracks(trackName).then((trackData) => {
      const track = trackData.body;
      if (track.tracks && track.tracks.items && track.tracks.items.length > 0) {
        spotifyApi.addTracksToPlaylist(spotifyPlaylist.id, [track.tracks.items[0].uri]);
        handleDialogClose(event);
      }
    });
  };

  public render(): React.ReactNode {
    const { spotifyPlaylist } = this.props;

    return (
      <Grid container={true}>
        <Grid container={true} item={true} xs={12}>
          <Grid item={true} xs={12}>
            <Button onClick={this.handleTrackAdd} style={{ padding: 0, color: "transparent" }}>
              <img src={spotifyPlaylist.images[0].url} alt={spotifyPlaylist.name} width={80} height={80} />
            </Button>
          </Grid>
          <Grid item={true} xs={12}>
            <Typography>{spotifyPlaylist.name}</Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

// eslint-disable-next-line arrow-body-style
export const SpotifyPlaylistsMap = React.memo<OuterProps>((props) => {
  return <SpotifyPlaylistsMapClass {...props} />;
});
