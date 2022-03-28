import { Button, Grid, Typography } from "@mui/material";
import * as React from "react";
import { extractThumbnail } from "../../helpers/thumbnails";

interface OuterProps {
  youtubePlaylist: gapi.client.youtube.Playlist;
}

export class YoutubePlaylistsMap extends React.PureComponent<OuterProps> {
  public render(): React.ReactNode {
    const { youtubePlaylist } = this.props;

    const imageUrl = extractThumbnail(youtubePlaylist.snippet?.thumbnails);

    return (
      <Grid container={true}>
        <Grid container={true} item={true} xs={12} style={{ paddingRight: 8 }}>
          <Grid item={true} xs={12}>
            <Button style={{ padding: 0, color: "transparent" }}>
              <img
                src={imageUrl}
                alt={youtubePlaylist.snippet?.title}
                width={80}
                height={80}
                style={{ objectFit: "scale-down", border: "1px solid black" }}
              />
            </Button>
          </Grid>
          <Grid item={true} xs={12}>
            <Typography>{youtubePlaylist.snippet?.title}</Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
