import * as React from "react";
import Play from "mdi-material-ui/Play";
import { Button, ButtonProps, TableCell, TableRow, Typography } from "@mui/material";
import SpotifyWebApi from "spotify-web-api-node";
import { WithStyles } from "@mui/styles";
import { TrackObject, usePlayerContext } from "../../context/player-context";
import { PlaylistStyles, usePlaylistStyles } from "./playlist.styles";
import { SourceType } from "./playlist-component";
import { extractThumbnail } from "../../helpers/thumbnails";
// eslint-disable-next-line import/no-cycle
import { TrackType } from "./playlist-class";
import { PlaylistType } from "../me/me-component";
import { TrackActionComponent } from "./track-actions-component";

interface OuterProps {
  row: SpotifyApi.PlaylistTrackObject | gapi.client.youtube.PlaylistItem | TrackType;
  playlist: SpotifyApi.PlaylistObjectSimplified | gapi.client.youtube.Playlist | PlaylistType;
  sourceType: SourceType;
  albumName?: string;
  spotifyApi: SpotifyWebApi;
  myOwn?: boolean;
}

interface InnerProps extends WithStyles<typeof PlaylistStyles> {
  setTrack: Function;
  setOpen: Function;
}

interface State {
  trackId: string;
  trackName: string;
  imageUrl: string;
  artistName: string;
  albumName: string;
  duration: string;
}

type Props = InnerProps & OuterProps;

class TracksTableContentClass extends React.PureComponent<Props, State> {
  public state: State = { albumName: "", artistName: "", duration: "", imageUrl: "", trackId: "", trackName: "" };

  constructor(props: Props) {
    super(props);

    const { sourceType, row, albumName } = props;

    if (sourceType === SourceType.Youtube) {
      this.resolveYoutubeTrack(row as gapi.client.youtube.PlaylistItem);
    } else if (sourceType === SourceType.Spotify) {
      this.resolveSpotifyTrack(row as SpotifyApi.PlaylistTrackObject);
    } else if (sourceType === SourceType.Own && albumName) {
      this.resolveOwnTrack(row as TrackType, albumName);
    }
  }

  private resolveOwnTrack = (ownRow: TrackType, albmName: string): void => {
    gapi.client.youtube.search.list({ part: "snippet", q: ownRow.trackName, maxResults: 999 }).then((results) => {
      const resultData = results.result;

      if (resultData && resultData.items && resultData?.items[0]?.id?.videoId) {
        this.setState({
          trackName: ownRow.trackName,
          imageUrl: ownRow.imageUrl,
          trackId: resultData.items[0].id.videoId,
          albumName: albmName,
          duration: "00:00",
          artistName: "artist"
        });
      }
    });
  };

  private resolveYoutubeTrack = (youtubeRow: gapi.client.youtube.PlaylistItem) => {
    gapi.client.youtube.videos
      .list({
        part: "contentDetails",
        id: youtubeRow.snippet?.resourceId?.videoId
      })
      .then((value) => {
        if (value.result && value.result.items && value.result.items[0].contentDetails?.duration) {
          const { duration: songDur } = value.result.items[0].contentDetails;

          const numberPattern = /\d+/g;
          const durations = songDur.match(numberPattern);

          if (durations && durations.length > 0 && youtubeRow.id && youtubeRow.snippet) {
            const { snippet } = youtubeRow;
            const image = extractThumbnail(snippet.thumbnails);

            let formattedDuration = "";

            if (durations[0].length === 1) {
              formattedDuration = `0${durations[0]}`;
            } else {
              // eslint-disable-next-line prefer-destructuring
              formattedDuration = durations[0];
            }

            if (durations[1].length === 1) {
              formattedDuration += `:0${durations[1]}`;
            } else {
              formattedDuration += `:${durations[1]}`;
            }

            if (snippet.title && image) {
              this.setState({
                trackId: youtubeRow.id,
                trackName: snippet.title,
                imageUrl: image,
                artistName: snippet.videoOwnerChannelTitle ?? "",
                albumName: "test",
                duration: formattedDuration
              });
            }
          }
        }
      });
  };

  private resolveSpotifyTrack = (spotifyRow: SpotifyApi.PlaylistTrackObject) => {
    const artists = spotifyRow.track.artists.map((artist, index) => {
      const { length } = spotifyRow.track.artists;
      if (length > 1 && index < length - 1) {
        return `${artist.name}, `;
      }
      return artist.name;
    });

    this.state = {
      trackId: spotifyRow.track.id,
      trackName: spotifyRow.track.name,
      imageUrl: spotifyRow.track.album.images[0].url,
      artistName: artists.join(""),
      albumName: spotifyRow.track.album.name,
      duration: this.convertMilliseconds(spotifyRow.track.duration_ms)
    };
  };

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

      if (youtubeRow.snippet) {
        const { snippet } = youtubeRow;
        if (imageUrl && snippet?.resourceId?.videoId && snippet.videoOwnerChannelTitle && snippet.title) {
          const currentTrack: TrackObject = {
            channelTitle: snippet.videoOwnerChannelTitle,
            thumbnail: imageUrl,
            title: snippet.title,
            videoId: snippet.resourceId?.videoId
          };

          setOpen(true);
          setTrack(currentTrack);
        }
      }
    } else if (sourceType === SourceType.Own) {
      const { trackId, imageUrl, trackName } = this.state;

      const currentTrack: TrackObject = {
        videoId: trackId,
        channelTitle: "title",
        thumbnail: imageUrl,
        title: trackName
      };

      setOpen(true);
      setTrack(currentTrack);
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
    const { classes, sourceType, spotifyApi, playlist, myOwn } = this.props;
    const { albumName, artistName, duration, imageUrl, trackId, trackName } = this.state;

    if (!albumName || !artistName || !duration || !imageUrl || !trackId || !trackName) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
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
        {sourceType !== SourceType.Youtube && (
          <TableCell style={{ minWidth: 500 }}>
            <Button className={classes.buttonTextHover} variant="text">
              <Typography fontFamily="Poppins, sans-serif" fontSize={16} className={classes.artistTypography}>
                {albumName}
              </Typography>
            </Button>
          </TableCell>
        )}
        <TableCell>
          <TrackActionComponent
            sourceType={sourceType}
            spotifyApi={spotifyApi}
            trackName={trackName}
            playlist={playlist}
            imageUrl={imageUrl}
            myOwn={myOwn}
          />
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
