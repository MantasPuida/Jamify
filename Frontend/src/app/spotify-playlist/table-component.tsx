import * as React from "react";
import Play from "mdi-material-ui/Play";
import { Button, ButtonProps, Grow, TableCell, TableRow, Typography } from "@mui/material";
import { NavigateFunction, useNavigate } from "react-router";
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
import { AppRoutes } from "../routes/routes";
import { FeaturedPlaylistState } from "../Home/featured-playlists/featured-card";
import { ArtistNameComponent } from "./artist-name-component";

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
  navigate: NavigateFunction;
}

interface State {
  trackId: string;
  trackName: string;
  imageUrl: string;
  artistName: string | string[];
  albumName: string;
  duration: string;
  isImageLoading: boolean;
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
      trackName: "",
      isImageLoading: true
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
        trackName: titleShort,
        isImageLoading: true
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
        trackName: title,
        isImageLoading: true
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
      artistName: ownRow.artists,
      isImageLoading: true
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
    const artists = spotifyRow.track.artists.map((artist) => artist.name);

    this.state = {
      trackId: spotifyRow.track.id,
      trackName: spotifyRow.track.name,
      imageUrl: spotifyRow.track.album.images[0].url,
      artistName: artists,
      albumName: spotifyRow.track.album.name,
      duration: this.convertMilliseconds(spotifyRow.track.duration_ms),
      isImageLoading: true
    };
  };

  private handleOnTrackClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { row, setTrack, setOpen, sourceType } = this.props;
    const { artistName } = this.state;
    let resolvedArtistNames = "";

    if (Array.isArray(artistName)) {
      resolvedArtistNames = artistName.join(", ");
    } else if (typeof artistName === "string") {
      resolvedArtistNames = artistName;
    }

    if (sourceType === SourceType.Spotify) {
      const spotifyRow = row as SpotifyApi.PlaylistTrackObject;
      const spArtists = spotifyRow.track.artists.map((artist) => artist.name).join(", ");

      gapi.client.youtube.search
        .list({
          part: "snippet",
          q: `${spotifyRow.track.name} ${spotifyRow.track.artists.map((artist) => artist.name).join(", ")}`
        })
        .then((value) => {
          if (value.result.items && value.result.items[0].id?.videoId) {
            const currentTrack: TrackObject = {
              channelTitle: spArtists,
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
        channelTitle: resolvedArtistNames,
        thumbnail: imageUrl,
        title: trackName
      };

      setOpen(true);
      setTrack(currentTrack);
    } else if (sourceType === SourceType.Deezer) {
      const deezerRow = row as DeezerPlaylistTrackType;

      const { artist, title, title_short: titleShort } = deezerRow;
      gapi.client.youtube.search.list({ part: "snippet", q: `${title} ${artist.name}` }).then((response) => {
        const { items } = response.result;

        if (items && items.length > 0 && items[0].id?.videoId) {
          const imgUrl = extractThumbnail(items[0].snippet?.thumbnails);

          const currentTrack: TrackObject = {
            videoId: items[0].id?.videoId,
            channelTitle: artist.name ?? resolvedArtistNames,
            thumbnail: imgUrl ?? "",
            title: titleShort
          };

          setOpen(true);
          setTrack(currentTrack);
        }
      });
    }
  };

  private handleOnAlbumClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { row, sourceType, spotifyApi, navigate, myOwn: isMine } = this.props;

    if (sourceType === SourceType.Spotify) {
      const spotifyRow = row as SpotifyApi.PlaylistTrackObject;

      spotifyApi.searchPlaylists(spotifyRow.track.album.name).then((response) => {
        if (response.body.playlists && response.body.playlists?.items.length > 0) {
          const playlist = response.body.playlists.items[0];

          navigate(AppRoutes.Playlist, { state: { spotifyPlaylist: playlist, myOwn: false } as FeaturedPlaylistState });
        }
      });
    } else if (sourceType === SourceType.Deezer && !isMine) {
      const deezerRow = row as DeezerPlaylistTrackType;

      DZ.api(`search/album?q=${deezerRow.title}`, (response) => {
        if (response.error) {
          // eslint-disable-next-line no-console
          console.error(response.error);
        } else {
          const { data } = response;

          if (data && data.length > 0) {
            const album = data[0];

            navigate(AppRoutes.Playlist, { state: { deezerAlbum: album, myOwn: false } as FeaturedPlaylistState });
          }
        }
      });
    } else if (sourceType === SourceType.Own) {
      const ownRow = row as TrackType;

      spotifyApi.searchPlaylists(ownRow.album).then((response) => {
        if (response.body.playlists && response.body.playlists?.items.length > 0) {
          const playlist = response.body.playlists.items[0];

          navigate(AppRoutes.Playlist, { state: { spotifyPlaylist: playlist, myOwn: false } as FeaturedPlaylistState });
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
    const { albumName, artistName, duration, imageUrl, trackId, trackName, isImageLoading } = this.state;

    if (!albumName || !artistName || !imageUrl || !trackId || !trackName) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    return (
      <Grow in={!isImageLoading} style={{ transformOrigin: "0 0 0" }} {...{ timeout: 1000 }}>
        <TableRow classes={{ hover: classes.hover }} hover={true} role="checkbox" tabIndex={-1} key={trackId}>
          <TableCell key={trackId} style={{ paddingLeft: 0, minWidth: 350, maxWidth: 550 }}>
            <Typography
              fontSize={20}
              fontWeight={200}
              fontFamily="Poppins,sans-serif"
              color="white"
              style={{ float: "left", paddingTop: sourceType !== SourceType.Youtube ? 8 : 0, paddingRight: 4 }}>
              {trackIndex}
            </Typography>
            <Button style={{ padding: 0, color: "transparent" }} onClick={this.handleOnTrackClick}>
              {isImageLoading && <img src="" alt="" className={classes.playlistImageStyle} />}
              <img
                className={classes.playlistImageStyle}
                src={imageUrl}
                alt={trackName}
                width={40}
                id="rowTrackImage"
                style={{ display: isImageLoading ? "none" : "block" }}
                onLoad={() => this.setState({ isImageLoading: false })}
              />
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
            {Array.isArray(artistName) &&
              artistName.map((artistNameMap, index) => {
                const comma = index !== artistName.length - 1 ? ", " : "";

                return <ArtistNameComponent artistName={`${artistNameMap}${comma}`} sourceType={sourceType} />;
              })}
            {typeof artistName === "string" && <ArtistNameComponent artistName={artistName} sourceType={sourceType} />}
          </TableCell>
          {sourceType !== SourceType.Youtube && (
            <TableCell style={{ minWidth: 500 }}>
              <Button className={classes.buttonTextHover} onClick={this.handleOnAlbumClick} variant="text">
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
            <Typography fontFamily="Poppins, sans-serif" fontSize={16} className={classes.artistTypographyNoHover}>
              {duration}
            </Typography>
          </TableCell>
        </TableRow>
      </Grow>
    );
  }
}

export const TracksTableContent = React.memo<OuterProps>((props) => {
  const { setTrack, setOpen } = usePlayerContext();
  const classes = usePlaylistStyles();
  const navigate = useNavigate();

  return (
    <TracksTableContentClass navigate={navigate} {...props} setTrack={setTrack} setOpen={setOpen} classes={classes} />
  );
});
