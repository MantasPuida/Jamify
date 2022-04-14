/* eslint-disable quotes */
import * as React from "react";
import { WithStyles } from "@mui/styles";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import memoizeOne from "memoize-one";
import { Stack, Grid, IconButton, IconButtonProps, Slider, SliderProps, Typography, styled } from "@mui/material";
import PauseRounded from "mdi-material-ui/Pause";
import PlayArrowRounded from "mdi-material-ui/Play";
import FastForwardRounded from "mdi-material-ui/FastForward";
import FastRewindRounded from "mdi-material-ui/Rewind";
import VolumeUpRounded from "mdi-material-ui/VolumeHigh";
import { TrackObject, usePlayerContext } from "../../context/player-context";
import { parseTitle } from "../../helpers/title-parser";
import { PlayerStyles, usePlayerStyles } from "./player.styles";
import { ArtistAlbumsResponse, PlaylistTracksResponse } from "../../types/deezer.types";
import { extractThumbnail } from "../../helpers/thumbnails";

const Widget = styled("div")(() => ({
  width: "100%",
  margin: "auto",
  position: "relative",
  height: 72,
  zIndex: 1,
  backgroundColor: "rgba(0,0,0,0.6)",
  backdropFilter: "blur(40px)"
}));

interface OuterProps {}

type SpotifyPlaylistTracksResponse = SpotifyApi.PlaylistTrackResponse;

interface TrackType {
  trackId: string;
  trackName: string;
  imageUrl: string;
  artists: string;
  duration: string;
  album: string;
}

type PlaylistTracksType =
  | SpotifyPlaylistTracksResponse
  | gapi.client.youtube.PlaylistItemListResponse
  | TrackType[]
  | ArtistAlbumsResponse
  | PlaylistTracksResponse;

interface QueueType {
  queue: PlaylistTracksType | undefined;
  source: "spotify" | "youtube" | "deezer" | "own";
}
interface InnerProps extends WithStyles<typeof PlayerStyles> {
  track?: TrackObject;
  duration: number;
  paused: boolean;
  position: number;
  volume: number;
  setDuration: Function;
  setPaused: Function;
  setPosition: Function;
  setVolume: Function;
  queue: QueueType | undefined;
  setQueue: React.Dispatch<React.SetStateAction<QueueType | undefined>>;
  setTrack: Function;
}

type Props = InnerProps & OuterProps;

class PlayerClass extends React.PureComponent<Props> {
  private playerRef: ReactPlayer | null = null;

  private formatDuration: (value: number) => string = memoizeOne((value) => {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft <= 9 ? `0${secondLeft}` : secondLeft}`;
  });

  private handleSliderOnChange: SliderProps["onChange"] = (_, value) => {
    const { setPosition } = this.props;

    setPosition(value as number);
    if (this.playerRef) {
      this.playerRef.seekTo(value as number);
    }
  };

  private handleVolumeOnChange: SliderProps["onChange"] = (_, value) => {
    const { setVolume } = this.props;
    const volumeNormalized = (value as number) / 100;

    setVolume(volumeNormalized);
  };

  private handleOnPlayPause: IconButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { setPaused, paused } = this.props;

    setPaused(!paused);
  };

  private handleOnDuration: ReactPlayerProps["onDuration"] = (songDuration) => {
    const { setDuration } = this.props;
    setDuration(songDuration);
  };

  private handleOnProgress: ReactPlayerProps["onProgress"] = (playedObj) => {
    const { playedSeconds } = playedObj;
    const { setPosition } = this.props;

    setPosition(Math.trunc(playedSeconds));
  };

  private handleOnNext: IconButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { queue, track, setTrack } = this.props;

    if (queue?.queue && track) {
      // find track in the queue
      if (queue.source === "spotify") {
        const data = queue.queue as SpotifyPlaylistTracksResponse;

        const trackIndex = data.items.findIndex((item) => item.track.name.includes(track.title));

        if (trackIndex !== -1) {
          const nextTrack = data.items[trackIndex + 1];

          if (nextTrack) {
            gapi.client.youtube.search
              .list({
                part: "snippet",
                q: `${nextTrack.track.name} ${nextTrack.track.artists[0].name}`
              })
              .then((value) => {
                if (value.result.items && value.result.items[0].id?.videoId) {
                  const currentTrack: TrackObject = {
                    channelTitle: nextTrack.track.album.name,
                    thumbnail: nextTrack.track.album.images[0].url,
                    title: nextTrack.track.name,
                    videoId: value.result.items[0].id?.videoId
                  };

                  setTrack(currentTrack);
                }
              });
          }
        }
      } else if (queue.source === "youtube") {
        const data = queue.queue as gapi.client.youtube.PlaylistItemListResponse;

        if (data.items && data.items.length > 0 && track) {
          const trackIndex = data.items.findIndex((item) => item.snippet?.title?.includes(track.title));

          if (trackIndex !== -1) {
            const nextTrack = data.items[trackIndex + 1];

            if (nextTrack && nextTrack.snippet && nextTrack.snippet.resourceId) {
              const { channelTitle, thumbnails, resourceId, title } = nextTrack.snippet;
              const imageUrl = extractThumbnail(thumbnails);

              const currentTrack: TrackObject = {
                channelTitle: channelTitle ?? "",
                thumbnail: imageUrl ?? "",
                title: title ?? "",
                videoId: resourceId.videoId ?? ""
              };

              setTrack(currentTrack);
            }
          }
        }
      } else if (queue.source === "deezer") {
        const data = queue.queue as ArtistAlbumsResponse;

        if (data.data && data.data.length > 0 && track) {
          const trackIndex = data.data.findIndex((item) => item.title.includes(track.title));

          if (trackIndex !== -1) {
            const nextTrack = data.data[trackIndex + 1];

            if (nextTrack) {
              gapi.client.youtube.search
                .list({
                  part: "snippet",
                  q: `${nextTrack.title} ${nextTrack.artist.name}`
                })
                .then((value) => {
                  if (value.result.items && value.result.items[0].id?.videoId) {
                    const img = extractThumbnail(value.result.items[0]?.snippet?.thumbnails);

                    const currentTrack: TrackObject = {
                      channelTitle: nextTrack.artist.name,
                      thumbnail: img ?? "",
                      title: nextTrack.title,
                      videoId: value.result.items[0].id?.videoId
                    };

                    setTrack(currentTrack);
                  }
                });
            }
          }
        }
      } else if (queue.source === "own") {
        const data = queue.queue as TrackType[];

        if (data.length > 0 && track) {
          const trackIndex = data.findIndex((item) => item.trackName.includes(track.title));

          if (trackIndex !== -1) {
            const nextTrack = data[trackIndex + 1];

            if (nextTrack) {
              gapi.client.youtube.search
                .list({
                  part: "snippet",
                  q: `${nextTrack.trackName} ${nextTrack.artists}`
                })
                .then((value) => {
                  if (value.result.items && value.result.items[0].id?.videoId) {
                    const currentTrack: TrackObject = {
                      channelTitle: nextTrack.album,
                      thumbnail: nextTrack.imageUrl,
                      title: nextTrack.trackName,
                      videoId: value.result.items[0].id?.videoId
                    };

                    setTrack(currentTrack);
                  }
                });
            }
          }
        }
      }
    }
  };

  private handleOnPrevious: IconButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { queue, track, setTrack } = this.props;

    if (queue?.queue && track) {
      if (queue.source === "spotify") {
        const data = queue.queue as SpotifyPlaylistTracksResponse;

        const trackIndex = data.items.findIndex((item) => item.track.name.includes(track.title));

        if (trackIndex !== -1) {
          const previousTrack = data.items[trackIndex - 1];

          if (previousTrack) {
            gapi.client.youtube.search
              .list({
                part: "snippet",
                q: `${previousTrack.track.name} ${previousTrack.track.artists[0].name}`
              })
              .then((value) => {
                if (value.result.items && value.result.items[0].id?.videoId) {
                  const currentTrack: TrackObject = {
                    channelTitle: previousTrack.track.album.name,
                    thumbnail: previousTrack.track.album.images[0].url,
                    title: previousTrack.track.name,
                    videoId: value.result.items[0].id?.videoId
                  };

                  setTrack(currentTrack);
                }
              });
          }
        }
      } else if (queue.source === "youtube") {
        const data = queue.queue as gapi.client.youtube.PlaylistItemListResponse;

        if (data.items && data.items.length > 0 && track) {
          const trackIndex = data.items.findIndex((item) => item.snippet?.title?.includes(track.title));

          if (trackIndex !== -1) {
            const previousTrack = data.items[trackIndex - 1];

            if (previousTrack && previousTrack.snippet && previousTrack.snippet.resourceId) {
              const { channelTitle, thumbnails, resourceId, title } = previousTrack.snippet;
              const imageUrl = extractThumbnail(thumbnails);

              const currentTrack: TrackObject = {
                channelTitle: channelTitle ?? "",
                thumbnail: imageUrl ?? "",
                title: title ?? "",
                videoId: resourceId.videoId ?? ""
              };

              setTrack(currentTrack);
            }
          }
        }
      } else if (queue.source === "deezer") {
        const data = queue.queue as ArtistAlbumsResponse;

        if (data.data && data.data.length > 0 && track) {
          const trackIndex = data.data.findIndex((item) => item.title.includes(track.title));

          if (trackIndex !== -1) {
            const previousTrack = data.data[trackIndex - 1];

            if (previousTrack) {
              gapi.client.youtube.search
                .list({
                  part: "snippet",
                  q: `${previousTrack.title} ${previousTrack.artist.name}`
                })
                .then((value) => {
                  if (value.result.items && value.result.items[0].id?.videoId) {
                    const img = extractThumbnail(value.result.items[0]?.snippet?.thumbnails);

                    const currentTrack: TrackObject = {
                      channelTitle: previousTrack.artist.name,
                      thumbnail: img ?? "",
                      title: previousTrack.title,
                      videoId: value.result.items[0].id?.videoId
                    };

                    setTrack(currentTrack);
                  }
                });
            }
          }
        }
      } else if (queue.source === "own") {
        const data = queue.queue as TrackType[];

        if (data.length > 0 && track) {
          const trackIndex = data.findIndex((item) => item.trackName.includes(track.title));

          if (trackIndex !== -1) {
            const previousTrack = data[trackIndex - 1];

            if (previousTrack) {
              gapi.client.youtube.search
                .list({
                  part: "snippet",
                  q: `${previousTrack.trackName} ${previousTrack.artists}`
                })
                .then((value) => {
                  if (value.result.items && value.result.items[0].id?.videoId) {
                    const currentTrack: TrackObject = {
                      channelTitle: previousTrack.album,
                      thumbnail: previousTrack.imageUrl,
                      title: previousTrack.trackName,
                      videoId: value.result.items[0].id?.videoId
                    };

                    setTrack(currentTrack);
                  }
                });
            }
          }
        }
      }
    }
  };

  public render(): React.ReactNode {
    const { track, classes, paused, position, volume, duration } = this.props;
    if (!track) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    const { channelTitle, thumbnail, title, videoId } = track;

    return (
      <Grid
        container={true}
        item={true}
        xs={12}
        style={{ width: "100%", bottom: 0, position: "fixed", backgroundColor: "#909090", zIndex: 1 }}>
        <Widget>
          <Grid item={true} xs={12}>
            <Slider
              aria-label="time-indicator"
              size="small"
              value={position}
              min={-0.6}
              step={1}
              max={duration}
              onChange={this.handleSliderOnChange}
              className={classes.slider}
            />
          </Grid>
          <Grid
            container={true}
            item={true}
            xs={12}
            style={{ display: "flex", alignItems: "center", marginTop: -10, width: "100%" }}>
            <Grid item={true} xs={8} style={{ paddingLeft: 8 }}>
              <Grid container={true} item={true} xs={12}>
                <IconButton aria-label="previous song" style={{ marginTop: -8 }} onClick={this.handleOnPrevious}>
                  <FastRewindRounded style={{ fontSize: "24px" }} htmlColor="#fff" />
                </IconButton>
                <IconButton
                  aria-label={paused ? "play" : "pause"}
                  onClick={this.handleOnPlayPause}
                  style={{ marginTop: -8 }}>
                  {paused ? (
                    <PlayArrowRounded sx={{ fontSize: "40px" }} htmlColor="#fff" />
                  ) : (
                    <PauseRounded sx={{ fontSize: "40px" }} htmlColor="#fff" />
                  )}
                </IconButton>
                <IconButton aria-label="next song" style={{ marginTop: -8 }} onClick={this.handleOnNext}>
                  <FastForwardRounded style={{ fontSize: "24px" }} htmlColor="#fff" />
                </IconButton>
                <Stack direction="column">
                  <Typography color="#aaa" style={{ paddingLeft: 16 }} fontSize={12}>
                    {this.formatDuration(position)} / {this.formatDuration(duration)}
                  </Typography>
                  <Stack
                    spacing={2}
                    direction="row"
                    alignItems="center"
                    style={{ justifyContent: "end", paddingLeft: 16 }}>
                    <Slider
                      id="customSliderId"
                      aria-label="Volume"
                      defaultValue={volume * 100}
                      size="small"
                      className={classes.volumeSlider}
                      onChange={this.handleVolumeOnChange}
                    />
                    <VolumeUpRounded className={classes.volumeIcon} />
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
            <Grid
              container={true}
              item={true}
              xs={4}
              style={{ display: "flex", alignItems: "center", justifyContent: "end", width: "100%", marginTop: -8 }}>
              <Grid item={true} xs={10} style={{ textAlign: "end", paddingRight: 8 }}>
                <Typography color="white" noWrap={true}>
                  {parseTitle(title)}
                </Typography>
                <Typography color="white" noWrap={true} letterSpacing={-0.25}>
                  {channelTitle}
                </Typography>
              </Grid>
              <Grid item={true} xs={2} style={{ textAlign: "end", paddingRight: 8 }}>
                <img alt="alt" src={thumbnail} width={68} height={68} style={{ objectFit: "scale-down" }} />
              </Grid>
            </Grid>
          </Grid>
        </Widget>
        <div style={{ display: "none" }}>
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${videoId}`}
            playing={!paused}
            volume={volume}
            onProgress={this.handleOnProgress}
            onDuration={this.handleOnDuration}
            ref={(ref) => {
              this.playerRef = ref;
            }}
          />
        </div>
      </Grid>
    );
  }
}

export const Player = React.memo<OuterProps>((props) => {
  const {
    track,
    position,
    paused,
    duration,
    volume,
    setPaused,
    setDuration,
    setPosition,
    setVolume,
    queue,
    setQueue,
    setTrack
  } = usePlayerContext();
  const classes = usePlayerStyles();

  return (
    <PlayerClass
      queue={queue}
      setTrack={setTrack}
      track={track}
      classes={classes}
      position={position}
      paused={paused}
      duration={duration}
      volume={volume}
      setPaused={setPaused}
      setDuration={setDuration}
      setPosition={setPosition}
      setVolume={setVolume}
      setQueue={setQueue}
      {...props}
    />
  );
});
