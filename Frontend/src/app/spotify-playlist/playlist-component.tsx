import * as React from "react";
import Play from "mdi-material-ui/Play";
import { WithStyles } from "@mui/styles";
import clsx from "clsx";
import { Button, Grid, Typography } from "@mui/material";
import { PlaylistStyles, usePlaylistStyles } from "./playlist.styles";
import { extractThumbnail } from "../../helpers/thumbnails";

import "./fontFamily.css";
import { PlaylistType } from "../me/me-component";

export enum SourceType {
  Spotify,
  Youtube,
  Own
}
interface OuterProps {
  playlist: SpotifyApi.PlaylistObjectSimplified | gapi.client.youtube.Playlist | PlaylistType;
  sourceType: SourceType;
}

type InnerProps = WithStyles<typeof PlaylistStyles>;

type Props = InnerProps & OuterProps;

class PlaylistComponentClass extends React.PureComponent<Props> {
  private parseDescription = (description: string | null): string | null => {
    if (description) {
      if (description.includes("<") || description.includes(">")) {
        const regex: RegExp = /<[^>]*>/gm;
        return description.replaceAll(regex, "");
      }

      return description;
    }

    return null;
  };

  public render(): React.ReactNode {
    const { classes, playlist, sourceType } = this.props;

    let playlistImage: string = "";
    let playlistName = "";
    let playlistDescription: string | null = "";

    if (sourceType === SourceType.Spotify) {
      const SpotifyPlaylist = playlist as SpotifyApi.PlaylistObjectSimplified;
      playlistImage = SpotifyPlaylist.images[0].url;
      playlistName = SpotifyPlaylist.name;
      playlistDescription = this.parseDescription(SpotifyPlaylist.description);
    } else if (sourceType === SourceType.Youtube) {
      const YoutubePlaylist = playlist as gapi.client.youtube.Playlist;

      if (YoutubePlaylist.snippet) {
        const { snippet } = YoutubePlaylist;

        const thumbnail = extractThumbnail(snippet.thumbnails);

        if (!thumbnail) {
          // eslint-disable-next-line react/jsx-no-useless-fragment
          return <></>;
        }

        playlistImage = thumbnail;
        playlistName = snippet.title ?? "My playlist";
      }
    } else if (sourceType === SourceType.Own) {
      const ownPlaylist = playlist as PlaylistType;
      playlistName = ownPlaylist.playlistName;
      playlistImage = ownPlaylist.playlistImage;
      playlistDescription = ownPlaylist.playlistDescription;
    }

    return (
      <Grid container={true} className={classes.playlistsGrid}>
        <Grid item={true} xs={4} style={{ maxWidth: "35%" }}>
          <img src={playlistImage} alt={playlistName} className={classes.playlistImage} />
        </Grid>
        <Grid
          container={true}
          item={true}
          xs={8}
          className={clsx({ [classes.optionalGridText]: sourceType === SourceType.Spotify }, classes.playlistGridText)}>
          <Grid item={true}>
            <Typography fontFamily="Poppins, sans-serif" color="white" fontWeight={700} fontSize={45}>
              {playlistName}
            </Typography>
          </Grid>
          <Grid item={true} style={{ width: "100%" }}>
            <Typography fontWeight={400} fontSize={16} style={{ color: "rgba(255, 255, 255, .7)" }}>
              {playlistDescription}
            </Typography>
          </Grid>
          <Grid item={true} style={{ width: "100%", marginTop: 40 }}>
            <Button
              style={{
                textTransform: "none",
                justifyContent: "left",
                backgroundColor: "white",
                color: "black",
                minWidth: 80,
                minHeight: 40
              }}
              startIcon={<Play />}
              variant="contained">
              <Typography fontFamily="Poppins, sans-serif" color="black" fontWeight={500} fontSize={15}>
                Play
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const PlaylistTopComponent = React.memo<OuterProps>((props) => {
  const classes = usePlaylistStyles();

  return <PlaylistComponentClass classes={classes} {...props} />;
});
