/* eslint-disable quotes */
import * as React from "react";
import { WithStyles } from "@mui/styles";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import { Stack, Grid, IconButton, IconButtonProps, Slider, SliderProps, Typography, Box, styled } from "@mui/material";
import PauseRounded from "mdi-material-ui/Pause";
import PlayArrowRounded from "mdi-material-ui/Play";
import FastForwardRounded from "mdi-material-ui/FastForward";
import FastRewindRounded from "mdi-material-ui/Rewind";
import VolumeUpRounded from "mdi-material-ui/VolumeHigh";
import VolumeDownRounded from "mdi-material-ui/VolumeMedium";
import { usePlayerContext } from "../../context/player-context";
import { extractThumbnail } from "../../helpers/thumbnails";
import { parseTitle } from "../../helpers/title-parser";
import { PlayerStyles, usePlayerStyles } from "./player.styles";

const Widget = styled("div")(() => ({
  padding: 16,
  borderRadius: 16,
  width: "100%",
  margin: "auto",
  position: "relative",
  zIndex: 1,
  backgroundColor: "rgba(0,0,0,0.6)",
  backdropFilter: "blur(40px)"
}));

const TinyText = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
  color: "white"
});

interface State {
  position: number;
  paused: boolean;
  volume: number;
  duration: number;
}

interface InnerProps extends WithStyles<typeof PlayerStyles> {
  track?: gapi.client.youtube.PlaylistItem;
}

class PlayerClass extends React.PureComponent<InnerProps, State> {
  public state: State = {
    position: 0,
    paused: false,
    volume: 0.5,
    duration: 0
  };

  private playerRef: ReactPlayer | null = null;

  private handleSliderOnChange: SliderProps["onChange"] = (_, value) => {
    this.setState({ position: value as number });
    if (this.playerRef) {
      this.playerRef.seekTo(value as number);
    }
  };

  private handleVolumeOnChange: SliderProps["onChange"] = (_, value) => {
    const volumeNormalized = (value as number) / 100;
    this.setState({ volume: volumeNormalized });
  };

  private handleOnPlayPause: IconButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState((state) => ({ paused: !state.paused }));
  };

  private handleOnDuration: ReactPlayerProps["onDuration"] = (songDuration) => {
    this.setState({ duration: songDuration });
  };

  private handleOnProgress: ReactPlayerProps["onProgress"] = (playedObj) => {
    const { playedSeconds } = playedObj;
    this.setState({ position: Math.trunc(playedSeconds) });
  };

  private formatDuration(value: number) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 9 ? `0${secondLeft}` : secondLeft}`;
  }

  public render(): React.ReactNode {
    const { track, classes } = this.props;
    if (!track || !track.id || !track.snippet || !track.snippet.thumbnails || !track.snippet.title) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    const { paused, position, volume, duration } = this.state;
    const mainIconColor = "#fff";
    const lightIconColor = "rgba(255,255,255,0.4)";

    const { snippet } = track;
    const { title, thumbnails, videoOwnerChannelTitle } = snippet;
    const imageUrl = extractThumbnail(thumbnails);

    return (
      <Grid container={true} item={true} xs={12} style={{ width: "100%", overflow: "hidden" }}>
        <Widget>
          <Grid item={true} xs={12}>
            <Slider
              aria-label="time-indicator"
              size="small"
              value={position}
              min={0}
              step={1}
              max={duration}
              onChange={this.handleSliderOnChange}
              className={classes.slider}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: -2
              }}
            >
              <TinyText>{this.formatDuration(position)}</TinyText>
              <TinyText>-{this.formatDuration(duration - position)}</TinyText>
            </Box>
          </Grid>
          <Grid
            container={true}
            item={true}
            xs={12}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: -1, width: "100%" }}
          >
            <Grid item={true} xs={3} style={{ justifyContent: "start" }}>
              <IconButton aria-label="previous song">
                <FastRewindRounded fontSize="large" htmlColor={mainIconColor} />
              </IconButton>
              <IconButton aria-label={paused ? "play" : "pause"} onClick={this.handleOnPlayPause}>
                {paused ? (
                  <PlayArrowRounded sx={{ fontSize: "3rem" }} htmlColor={mainIconColor} />
                ) : (
                  <PauseRounded sx={{ fontSize: "3rem" }} htmlColor={mainIconColor} />
                )}
              </IconButton>
              <IconButton aria-label="next song">
                <FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
              </IconButton>
            </Grid>
            <Grid
              item={true}
              xs={6}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}
            >
              <img alt="can't win - Chilling Sunday" src={imageUrl} width={96} />
              <Box sx={{ ml: 1.5, minWidth: 0, color: "white" }}>
                <Typography fontWeight={400} fontFamily="Poppins,sans-serif" noWrap={true}>
                  {parseTitle(title)}
                </Typography>
                <Typography fontWeight={400} fontFamily="Poppins,sans-serif" noWrap={true} letterSpacing={-0.25}>
                  {videoOwnerChannelTitle}
                </Typography>
              </Box>
            </Grid>
            <Grid item={true} xs={3} style={{ width: "100%" }}>
              <Stack
                spacing={2}
                direction="row"
                sx={{ mb: 1, px: 1 }}
                alignItems="center"
                style={{ justifyContent: "end" }}
              >
                <VolumeDownRounded htmlColor={lightIconColor} />
                <Slider
                  aria-label="Volume"
                  defaultValue={0}
                  className={classes.volumeSlider}
                  onChange={this.handleVolumeOnChange}
                />
                <VolumeUpRounded htmlColor={lightIconColor} />
              </Stack>
            </Grid>
          </Grid>
        </Widget>
        <div style={{ display: "none" }}>
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${snippet.resourceId?.videoId}`}
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

export const Player = React.memo(() => {
  const { track } = usePlayerContext();
  const classes = usePlayerStyles();

  return <PlayerClass track={track} classes={classes} />;
});
