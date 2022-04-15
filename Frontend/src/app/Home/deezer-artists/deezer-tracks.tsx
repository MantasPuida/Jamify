import * as React from "react";
import { Button, ButtonProps, Grid, Typography } from "@mui/material";
import Play from "mdi-material-ui/Play";
import { WithStyles } from "@mui/styles";
import { DeezerStyles, useDeezerStyles } from "./deezer.styles";
import { useAppContext } from "../../../context/app-context";
import { TrackObject, usePlayerContext } from "../../../context/player-context";
import { LastTick } from "../../../utils/last-tick";
import { Track } from "../../../types/deezer.types";

interface OuterProps {
  track: Track;
  changeState: () => void;
}

interface InnerProps extends WithStyles<typeof DeezerStyles> {
  setPlayerOpen: Function;
  setPlayerTrack: Function;
  setLoading: Function;
  isOpen: boolean;
}

type Props = InnerProps & OuterProps;

class DeezerTracksClass extends React.PureComponent<Props> {
  componentDidMount() {
    const { setLoading, changeState } = this.props;

    setTimeout(() => {
      LastTick(() => {
        changeState();
        setLoading(false);
      });
    }, 1000);
  }

  private handleOnTrackClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { track, isOpen, setPlayerOpen, setPlayerTrack } = this.props;

    gapi.client.youtube.search
      .list({
        part: "snippet",
        q: `${track.title} ${track.artist.name ?? ""}`
      })
      .then((value) => {
        if (value.result.items && value.result.items[0].id?.videoId) {
          const currentTrack: TrackObject = {
            videoId: value.result.items[0].id.videoId,
            title: track.title_short ?? "",
            thumbnail: track.album.cover_xl ?? "",
            channelTitle: track.album.title ?? ""
          };

          if (!isOpen) {
            setPlayerOpen(true);
          }
          setPlayerTrack(currentTrack);
        }
      });
  };

  public render(): React.ReactNode {
    const { track, classes } = this.props;

    return (
      <Grid container={true} item={true} xs={12} key={track.id}>
        <Grid item={true} xs={2}>
          <Button onClick={this.handleOnTrackClick}>
            <img
              src={track.album.cover_xl}
              alt={track.title}
              className={classes.tracksCarouselImage}
              id="gridRowTrack"
            />
            <div style={{ position: "absolute", width: 32, height: 32, marginTop: 8 }}>
              <Play id="ytPlaySvgIcon" style={{ color: "white", display: "none" }} />
            </div>
          </Button>
        </Grid>
        <Grid container={true} item={true} xs={10} style={{ textAlign: "left" }}>
          <Grid item={true} xs={10}>
            <Button
              onClick={this.handleOnTrackClick}
              style={{
                textAlign: "left",
                textTransform: "none",
                justifyContent: "left",
                maxWidth: 425,
                paddingTop: 4,
                paddingBottom: 2,
                color: "transparent"
              }}
              variant="text">
              <Typography
                className={classes.tracksTypography}
                fontFamily="Poppins,sans-serif"
                fontSize={16}
                color="white">
                {track.title_short}
              </Typography>
            </Button>
          </Grid>
          <Grid item={true} xs={10}>
            <Button
              style={{
                textAlign: "left",
                textTransform: "none",
                justifyContent: "left",
                maxWidth: 425,
                color: "transparent",
                paddingTop: 0,
                paddingBottom: 0
              }}
              className={classes.tracksButtonOnHover}
              variant="text">
              <Typography className={classes.tracksHelperTypography} fontFamily="Poppins,sans-serif" fontSize={12}>
                {track.album.title}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const DeezerTracks = React.memo<OuterProps>((props) => {
  const { setLoading } = useAppContext();
  const { isOpen, setOpen, setTrack } = usePlayerContext();
  const classes = useDeezerStyles();

  return (
    <DeezerTracksClass
      {...props}
      isOpen={isOpen}
      setLoading={setLoading}
      classes={classes}
      setPlayerOpen={setOpen}
      setPlayerTrack={setTrack}
    />
  );
});
