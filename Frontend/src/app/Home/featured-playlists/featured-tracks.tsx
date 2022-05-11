import * as React from "react";
import { Button, ButtonProps, Grid, Grow, Typography } from "@mui/material";
import Play from "mdi-material-ui/Play";
import { WithStyles } from "@mui/styles";
import { FeaturedPlaylistsStyles, useFeaturedPlaylistsStyles } from "./featured.styles";
import { TrackObjectSimplified } from "../../../types/spotify.types";
import { useAppContext } from "../../../context/app-context";
import { TrackObject, usePlayerContext } from "../../../context/player-context";
import { LastTick } from "../../../utils/last-tick";
import { ArtistsMapped } from "./artists-mapped";

interface OuterProps {
  track: TrackObjectSimplified;
  shouldSetLoading: boolean;
  changeState: () => void;
  loading: boolean;
}

interface InnerProps extends WithStyles<typeof FeaturedPlaylistsStyles> {
  setPlayerOpen: Function;
  setPlayerTrack: Function;
  isOpen: boolean;
  setLoading: Function;
}

type Props = InnerProps & OuterProps;

interface State {
  isImageLoading: boolean;
}

class FeaturedTracksClass extends React.PureComponent<Props, State> {
  public state: State = { isImageLoading: true };

  componentDidMount() {
    const { shouldSetLoading, setLoading, changeState } = this.props;

    if (shouldSetLoading) {
      setLoading(false);
    }

    LastTick(() => {
      changeState();
    });
  }

  private handleOnTrackClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { track, isOpen, setPlayerOpen, setPlayerTrack } = this.props;

    gapi.client.youtube.search
      .list({
        part: "snippet",
        q: `${track.name} ${track.artists.join(", ") ?? ""}`
      })
      .then((value) => {
        if (value.result.items && value.result.items[0].id?.videoId) {
          const currentTrack: TrackObject = {
            videoId: value.result.items[0].id.videoId,
            title: track.name ?? "",
            thumbnail: track.album.images[0].url ?? "",
            channelTitle: track.album.name ?? ""
          };

          if (!isOpen) {
            setPlayerOpen(true);
          }
          setPlayerTrack(currentTrack);
        }
      });
  };

  public render(): React.ReactNode {
    const { track, classes, loading } = this.props;
    const { isImageLoading } = this.state;

    const { name, artists, album } = track;

    return (
      <Grow in={!loading && !isImageLoading} style={{ transformOrigin: "0 0 0" }} {...{ timeout: 1000 }}>
        <Grid container={true} item={true} xs={12} key={track.id}>
          <Grid item={true} xs={4}>
            <Button onClick={this.handleOnTrackClick} style={{ width: 140 }}>
              {isImageLoading || (loading && <img src="" alt="dummy" className={classes.carouselImage} />)}
              <img
                src={album.images[0].url}
                alt={name}
                className={classes.carouselImage}
                style={{ display: isImageLoading ? "none" : "block" }}
                id="gridRowTrack"
                onLoad={() => this.setState({ isImageLoading: false })}
              />
              <div style={{ position: "absolute", width: 32, height: 32, marginTop: 8 }}>
                <Play id="ytPlaySvgIcon" style={{ color: "white", display: "none" }} />
              </div>
            </Button>
          </Grid>
          <Grid container={true} item={true} xs={8} style={{ textAlign: "left" }}>
            <Grid item={true} xs={10} style={{ marginTop: 12 }}>
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
            <Grid item={true} xs={10} style={{ marginBottom: 12 }}>
              {artists.map((artist, artistIndex) => (
                <ArtistsMapped artist={artist} arrayLength={artists.length} artistIndex={artistIndex} key={artist.id} />
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grow>
    );
  }
}

export const FeaturedTracks = React.memo<OuterProps>((props) => {
  const { setLoading } = useAppContext();
  const { setOpen, setTrack, isOpen } = usePlayerContext();
  const classes = useFeaturedPlaylistsStyles();

  return (
    <FeaturedTracksClass
      {...props}
      isOpen={isOpen}
      setLoading={setLoading}
      classes={classes}
      setPlayerOpen={setOpen}
      setPlayerTrack={setTrack}
    />
  );
});
