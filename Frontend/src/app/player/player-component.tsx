/* eslint-disable quotes */
import * as React from "react";
import { WithStyles } from "@mui/styles";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import memoizeOne from "memoize-one";
import { Stack, Grid, IconButton, IconButtonProps, Slider, SliderProps, Typography, Box, styled } from "@mui/material";
import PauseRounded from "mdi-material-ui/Pause";
import PlayArrowRounded from "mdi-material-ui/Play";
import FastForwardRounded from "mdi-material-ui/FastForward";
import FastRewindRounded from "mdi-material-ui/Rewind";
import VolumeUpRounded from "mdi-material-ui/VolumeHigh";
import { TrackObject, usePlayerContext } from "../../context/player-context";
import { parseTitle } from "../../helpers/title-parser";
import { PlayerStyles, usePlayerStyles } from "./player.styles";

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
        style={{ width: "100%", bottom: 0, position: "fixed", backgroundColor: "#909090", zIndex: 1, marginTop: 150 }}>
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
            style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: -6, width: "100%" }}>
            <Grid item={true} xs={3} style={{ paddingLeft: 8 }}>
              <Grid container={true} item={true} xs={12}>
                <IconButton aria-label="previous song" style={{ marginTop: -8 }}>
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
                <IconButton aria-label="next song" style={{ marginTop: -8 }}>
                  <FastForwardRounded style={{ fontSize: "24px" }} htmlColor="#fff" />
                </IconButton>
                <Typography color="#aaa" style={{ paddingLeft: 16, marginTop: 10 }} fontSize={12}>
                  {this.formatDuration(position)} / {this.formatDuration(duration)}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item={true}
              xs={6}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginTop: -8 }}>
              <img alt="alt" src={thumbnail} width={60} height={60} style={{ objectFit: "scale-down" }} />
              <Box sx={{ ml: 1.5, minWidth: 0, color: "white" }}>
                <Typography noWrap={true}>{parseTitle(title)}</Typography>
                <Typography noWrap={true} letterSpacing={-0.25}>
                  {channelTitle}
                </Typography>
              </Box>
            </Grid>
            <Grid item={true} xs={3} style={{ width: "100%", paddingRight: 8 }}>
              <Stack
                spacing={2}
                direction="row"
                sx={{ mb: 1, px: 1 }}
                alignItems="center"
                style={{ justifyContent: "end" }}>
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
  const { track, position, paused, duration, volume, setPaused, setDuration, setPosition, setVolume } =
    usePlayerContext();
  const classes = usePlayerStyles();

  return (
    <PlayerClass
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
      {...props}
    />
  );
});
