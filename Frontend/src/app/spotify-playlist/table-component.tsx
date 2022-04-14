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
import { Album, ArtistAlbumsData, OmittedPlaylistResponse, PlaylistTracksData } from "../../types/deezer.types";

type DeezerPlaylistType = Album | OmittedPlaylistResponse;
type DeezerPlaylistTrackType = ArtistAlbumsData | PlaylistTracksData;

interface OuterProps {
  row:
    | SpotifyApi.PlaylistTrackObject
    | gapi.client.youtube.PlaylistItem
    | TrackType
    | ArtistAlbumsData
    | DeezerPlaylistTrackType;
  playlist: SpotifyApi.PlaylistObjectSimplified | gapi.client.youtube.Playlist | PlaylistType | DeezerPlaylistType;
  sourceType: SourceType;
  albumName?: string;
  spotifyApi: SpotifyWebApi;
  myOwn?: boolean;
  trackIndex: number;
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
  public state: State;

  constructor(props: Props) {
    super(props);

    const { sourceType, row } = props;

    this.state = {
      albumName: "",
      artistName: "",
      duration: "",
      imageUrl: "",
      trackId: "",
      trackName: ""
    };

    if (sourceType === SourceType.Youtube) {
      this.resolveYoutubeTrack(row as gapi.client.youtube.PlaylistItem);
    } else if (sourceType === SourceType.Spotify) {
      this.resolveSpotifyTrack(row as SpotifyApi.PlaylistTrackObject);
    } else if (sourceType === SourceType.Own) {
      this.resolveOwnTrack(row as TrackType);
    } else if (sourceType === SourceType.Deezer) {
      this.resolveDeezerTrack(row as DeezerPlaylistTrackType);
    }
  }

  private resolveDeezerTrack = (row: DeezerPlaylistTrackType) => {
    const { playlist } = this.props;
    const deezerPlaylist = playlist as DeezerPlaylistType;

    if (deezerPlaylist.type === "album") {
      const currentPlaylist = deezerPlaylist as Album;
      const { artist, title_short: titleShort, duration, id } = row as ArtistAlbumsData;
      const resolvedDuration = this.resolveDuration(duration);

      this.state = {
        albumName: currentPlaylist.title,
        artistName: artist.name,
        duration: resolvedDuration,
        imageUrl: currentPlaylist.cover_xl,
        trackId: id.toString(),
        trackName: titleShort
      };
    } else if (deezerPlaylist.type === "playlist") {
      const currentPlaylist = deezerPlaylist as OmittedPlaylistResponse;
      const { artist, title, duration, id } = row as PlaylistTracksData;
      const resolvedDuration = this.resolveDuration(duration);

      if (!currentPlaylist.title || !artist.name || !title || !resolvedDuration) {
        return;
      }

      this.state = {
        albumName: currentPlaylist.title,
        artistName: artist.name,
        duration: resolvedDuration,
        imageUrl: artist.picture_xl,
        trackId: id.toString(),
        trackName: title
      };
    }
  };

  private resolveDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    return `${minutes > 10 ? minutes : `0${minutes}`}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  private resolveOwnTrack = (ownRow: TrackType): void => {
    this.state = {
      trackName: ownRow.trackName,
      imageUrl: ownRow.imageUrl,
      trackId: ownRow.trackId,
      albumName: ownRow.album,
      duration: ownRow.duration,
      artistName: ownRow.artists
    };
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

            if (durations.length === 1) {
              formattedDuration = `0${durations[0]}:00`;
            } else if (durations.length > 1) {
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
    } else if (sourceType === SourceType.Deezer) {
      const deezerRow = row as DeezerPlaylistTrackType;

      const { artist, title, title_short: titleShort } = deezerRow;
      gapi.client.youtube.search.list({ part: "snippet", q: `${title} ${artist}` }).then((response) => {
        const { items } = response.result;

        if (items && items.length > 0 && items[0].id?.videoId) {
          const imgUrl = extractThumbnail(items[0].snippet?.thumbnails);

          const currentTrack: TrackObject = {
            videoId: items[0].id?.videoId,
            channelTitle: "title",
            thumbnail: imgUrl ?? "",
            title: titleShort
          };

          setOpen(true);
          setTrack(currentTrack);
        }
      });
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
    const { classes, sourceType, spotifyApi, playlist, myOwn, trackIndex } = this.props;
    const { albumName, artistName, duration, imageUrl, trackId, trackName } = this.state;

    if (!albumName || !artistName || !imageUrl || !trackId || !trackName) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    return (
      <TableRow classes={{ hover: classes.hover }} hover={true} role="checkbox" tabIndex={-1} key={trackId}>
        <TableCell key={trackId} style={{ paddingLeft: 0, minWidth: 350, maxWidth: 550 }}>
          <Typography
            fontSize={20}
            fontWeight={200}
            fontFamily="Poppins,sans-serif"
            color="white"
            style={{ float: "left", paddingTop: sourceType !== SourceType.Youtube ? 8 : 0 }}>
            {trackIndex}
          </Typography>
          <Button style={{ padding: 0, color: "transparent" }} onClick={this.handleOnTrackClick}>
            <img className={classes.playlistImageStyle} src={imageUrl} alt={trackName} width={40} id="rowTrackImage" />
            <div className={classes.playlistIconButton}>
              <Play id="playSvgIcon" className={classes.playlistIconButtonIcon} />
            </div>
          </Button>
          <Button className={classes.buttonText} variant="text" onClick={this.handleOnTrackClick}>
            <Typography
              className={classes.typography}
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
        <TableCell style={{ textAlign: sourceType === SourceType.Youtube ? "center" : "initial" }}>
          <TrackActionComponent
            sourceType={sourceType}
            spotifyApi={spotifyApi}
            trackName={trackName}
            playlist={playlist}
            imageUrl={imageUrl}
            myOwn={myOwn}
            artists={artistName}
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
