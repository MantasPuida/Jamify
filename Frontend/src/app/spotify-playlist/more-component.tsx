import * as React from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { IconButton, IconButtonProps, ButtonProps } from "@mui/material";
import DotsVertical from "mdi-material-ui/DotsVertical";
import { SourceType } from "./playlist-component";
import { TrackDialog } from "./track-dialog";
import { PlaylistType } from "../me/me-component";

interface InnerProps {
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDialogOpen: boolean;
}

interface OuterProps {
  sourceType: SourceType;
  spotifyApi: SpotifyWebApi;
  trackName: string;
  playlist: SpotifyApi.PlaylistObjectSimplified | gapi.client.youtube.Playlist | PlaylistType;
  imageUrl: string;
}

type Props = InnerProps & OuterProps;

class MoreMenuClass extends React.PureComponent<Props> {
  private handleDialogClose: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { setDialogOpen } = this.props;

    setDialogOpen(false);
  };

  private handleDialogOpen: IconButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { setDialogOpen } = this.props;

    setDialogOpen(true);
  };

  public render(): React.ReactNode {
    const { sourceType, isDialogOpen, spotifyApi, trackName, playlist, imageUrl } = this.props;
    const marginStyle = sourceType === SourceType.Spotify ? "0px" : "25%";
    const displayStyle = isDialogOpen ? "block" : "none";

    return (
      <>
        <IconButton
          onClick={this.handleDialogOpen}
          style={{ padding: 0, color: "rgba(255, 255, 255, .7)", float: "left", marginLeft: marginStyle }}>
          <DotsVertical id="DotsSvgIcon" style={{ display: displayStyle, color: "1px solid rgba(255,255,255,0.1)" }} />
        </IconButton>
        <TrackDialog
          isDialogOpen={isDialogOpen}
          handleDialogClose={this.handleDialogClose}
          spotifyApi={spotifyApi}
          trackName={trackName}
          sourceType={sourceType}
          currentPlaylist={playlist}
          imageUrl={imageUrl}
        />
      </>
    );
  }
}

export const MoreMenu = React.memo<OuterProps>((props) => {
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  return <MoreMenuClass isDialogOpen={isDialogOpen} setDialogOpen={setDialogOpen} {...props} />;
});
