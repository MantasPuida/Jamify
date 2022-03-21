import * as React from "react";
import Play from "mdi-material-ui/Play";
import { Button, ButtonProps, TableCell, TableRow, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { TrackObject, usePlayerContext } from "../../context/player-context";
import { PlaylistStyles, usePlaylistStyles } from "./playlist.styles";
import { SourceType } from "./playlist-component";
import { extractThumbnail } from "../../helpers/thumbnails";

interface OuterProps {
  row: SpotifyApi.PlaylistTrackObject | gapi.client.youtube.PlaylistItem;
  sourceType: SourceType;
}

interface InnerProps extends WithStyles<typeof PlaylistStyles> {
  setTrack: Function;
  setOpen: Function;
}

type Props = InnerProps & OuterProps;

class TracksTableContentClass extends React.PureComponent<Props> {
  private handleOnTrackClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { row, setTrack, setOpen, sourceType } = this.props;

    if (sourceType === SourceType.Spotify) {
      const spotifyRow = row as SpotifyApi.PlaylistTrackObject;

      gapi.client.youtube.search
        .list({
          part: "snippet",
          q: spotifyRow.track.name
        })
        .then((value) => {
          if (value.result.items && value.result.items[0].id?.videoId) {
            const currentTrack: TrackObject = {
              channelTitle: spotifyRow.track.album.name,
              thumbnail: spotifyRow.track.album.images[0].url,
              title: spotifyRow.track.name,
              videoId: value.result.items[0].id.videoId
            };

            setOpen(true);
            setTrack(currentTrack);
          }
        });
    } else if (sourceType === SourceType.Youtube) {
      const youtubeRow = row as gapi.client.youtube.PlaylistItem;

      const imageUrl = extractThumbnail(youtubeRow.snippet?.thumbnails);
      // console.log(youtubeRow.id);

      gapi.client.youtube.videos
        .list({
          part: "snippet",
          id: youtubeRow.id
        })
        .then((value) => console.log(value));

      if (youtubeRow.id && imageUrl) {
        const currentTrack: TrackObject = {
          videoId: youtubeRow.id,
          thumbnail: imageUrl,
          title: youtubeRow.snippet?.title ?? "",
          channelTitle: youtubeRow.snippet?.channelTitle ?? ""
        };

        setOpen(true);
        setTrack(currentTrack);
      }
    }
  };

  private convertMilliseconds = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);

    let duration: string = minutes.toString();

    if (minutes < 10) {
      duration = `0${minutes}:`;
    }

    if (Number(seconds) < 10) {
      duration += `0${seconds}`;
    } else {
      duration += seconds;
    }

    return duration;
  };

  public render(): React.ReactNode {
    const { row, classes, sourceType } = this.props;

    let trackId = "";
    let trackName = "";
    let imageUrl = "";
    let artistName = "";
    let albumName = "";
    let duration = "";

    if (sourceType === SourceType.Youtube) {
      const youtubeRow = row as gapi.client.youtube.PlaylistItem;

      trackId = youtubeRow.id ?? "randomId";
      if (youtubeRow.snippet) {
        const { snippet } = youtubeRow;
        const image = extractThumbnail(snippet.thumbnails);
        if (snippet.title && image) {
          trackName = snippet.title;
          imageUrl = image;
          artistName = snippet.videoOwnerChannelTitle ?? "";
          albumName = "album name";
          duration = "00:00";
        }
      }
    }

    if (sourceType === SourceType.Spotify) {
      const spotifyRow = row as SpotifyApi.PlaylistTrackObject;

      const artists = spotifyRow.track.artists.map((artist, index) => {
        const { length } = spotifyRow.track.artists;
        if (length > 1 && index < length - 1) {
          return `${artist.name}, `;
        }
        return artist.name;
      });

      trackId = spotifyRow.track.id;
      trackName = spotifyRow.track.name;
      imageUrl = spotifyRow.track.album.images[0].url;
      artistName = artists.join("");
      albumName = spotifyRow.track.album.name;
      duration = this.convertMilliseconds(spotifyRow.track.duration_ms);
    }

    return (
      <TableRow classes={{ hover: classes.hover }} hover={true} role="checkbox" tabIndex={-1} key={trackId}>
        <TableCell key={trackId} style={{ paddingLeft: 0, minWidth: 350, maxWidth: 550 }}>
          <Button style={{ padding: 0, color: "transparent" }} onClick={this.handleOnTrackClick}>
            <img className={classes.playlistImageStyle} src={imageUrl} alt={trackName} width={40} id="rowTrackImage" />
            <div className={classes.playlistIconButton}>
              <Play id="playSvgIcon" className={classes.playlistIconButtonIcon} />
            </div>
          </Button>
          <Button className={classes.buttonText} variant="text">
            <Typography
              style={{ height: "100%", marginTop: 4, textAlign: "left", minWidth: 400 }}
              fontFamily="Poppins, sans-serif"
              fontSize={16}
              fontWeight={500}
              color="white">
              {trackName}
            </Typography>
          </Button>
        </TableCell>
        <TableCell className={classes.artistTableCell}>
          <Button className={classes.buttonTextHover} variant="text">
            <Typography fontFamily="Poppins, sans-serif" fontSize={16} className={classes.artistTypography}>
              {artistName}
            </Typography>
          </Button>
        </TableCell>
        <TableCell style={{ minWidth: 500 }}>
          <Button className={classes.buttonTextHover} variant="text">
            <Typography fontFamily="Poppins, sans-serif" fontSize={16} className={classes.artistTypography}>
              {albumName}
            </Typography>
          </Button>
        </TableCell>
        <TableCell style={{ textAlign: "end" }}>
          <Typography fontFamily="Poppins, sans-serif" fontSize={16} className={classes.artistTypography}>
            {duration}
          </Typography>
        </TableCell>
      </TableRow>
    );
  }
}

export const TracksTableContent = React.memo<OuterProps>((props) => {
  const { setTrack, setOpen } = usePlayerContext();
  const classes = usePlaylistStyles();

  return <TracksTableContentClass {...props} setTrack={setTrack} setOpen={setOpen} classes={classes} />;
});
