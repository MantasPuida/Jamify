import * as React from "react";
import { Button, ButtonProps, Grid, Typography } from "@mui/material";
import Play from "mdi-material-ui/Play";
import { WithStyles } from "@mui/styles";
import { FeaturedPlaylistsStyles, useFeaturedPlaylistsStyles } from "./featured.styles";
import { TrackObjectSimplified } from "../../../types/spotify.types";
import { useAppContext } from "../../../context/app-context";
import { usePlayerContext } from "../../../context/player-context";
import { LastTick } from "../../../utils/last-tick";

interface OuterProps {
  track: TrackObjectSimplified;
  shouldSetLoading: boolean;
  changeState: () => void;
}

interface InnerProps extends WithStyles<typeof FeaturedPlaylistsStyles> {
  setPlayerOpen: Function;
  setPlayerTrack: Function;
  setLoading: Function;
}

type Props = InnerProps & OuterProps;

class FeaturedTracksClass extends React.PureComponent<Props> {
  componentDidMount() {
    const { shouldSetLoading, setLoading, changeState } = this.props;

    if (shouldSetLoading) {
      setLoading(false);
    }

    setTimeout(() => {
      LastTick(() => {
        changeState();
      });
    }, 1000);
  }

  private handleOnTrackClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  public render(): React.ReactNode {
    const { track, classes } = this.props;

    const { album, name } = track;

    return (
      <Grid container={true} item={true} xs={12} key={track.id}>
        <Grid item={true} xs={2}>
          <Button onClick={this.handleOnTrackClick}>
            <img src={album.images[0].url} alt={name} className={classes.carouselImage} id="gridRowTrack" />
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
              <Typography className={classes.typography} fontFamily="Poppins,sans-serif" fontSize={16} color="white">
                {name}
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
              className={classes.buttonOnHover}
              variant="text">
              <Typography className={classes.helperTypography} fontFamily="Poppins,sans-serif" fontSize={12}>
                {album.name}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const FeaturedTracks = React.memo<OuterProps>((props) => {
  const { setLoading } = useAppContext();
  const { setOpen, setTrack } = usePlayerContext();
  const classes = useFeaturedPlaylistsStyles();

  return (
    <FeaturedTracksClass
      {...props}
      setLoading={setLoading}
      classes={classes}
      setPlayerOpen={setOpen}
      setPlayerTrack={setTrack}
    />
  );
});
