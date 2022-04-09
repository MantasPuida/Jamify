import * as React from "react";
import { Button, ButtonProps, Grid, Typography } from "@mui/material";
import Play from "mdi-material-ui/Play";
import { WithStyles } from "@mui/styles";
import { YoutubeTracksStyles, useYoutubeTracksStyles } from "./playlist.styles";

import "./fontFamily.css";
import { TrackObject, usePlayerContext } from "../../context/player-context";
import { parseTitle } from "../../helpers/title-parser";
import { extractThumbnail } from "../../helpers/thumbnails";
import { useAppContext } from "../../context/app-context";

interface OuterProps {
  track: gapi.client.youtube.PlaylistItem;
  shouldSetLoading: boolean;
}

interface InnerProps extends WithStyles<typeof YoutubeTracksStyles> {
  setPlayerOpen: Function;
  setPlayerTrack: Function;
  setLoading: Function;
}

type Props = InnerProps & OuterProps;

class TracksCardsClass extends React.PureComponent<Props> {
  componentDidMount() {
    const { setLoading, shouldSetLoading } = this.props;

    if (shouldSetLoading) {
      setLoading(false);
    }
  }

  private handleOnTrackClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { setPlayerOpen, setPlayerTrack, track } = this.props;

    if (track.snippet) {
      const { snippet } = track;

      if (snippet.videoOwnerChannelTitle && snippet.thumbnails && snippet.title && snippet.resourceId?.videoId) {
        setPlayerOpen(true);

        const currentTrack: TrackObject = {
          channelTitle: snippet.videoOwnerChannelTitle,
          thumbnail: extractThumbnail(snippet.thumbnails)!,
          title: snippet.title,
          videoId: snippet.resourceId.videoId
        };

        setPlayerTrack(currentTrack);
      }
    }
  };

  public render(): React.ReactNode {
    const { track, classes } = this.props;

    if (!track.id || !track.snippet || !track.snippet.thumbnails || !track.snippet.title) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    const { title, thumbnails, videoOwnerChannelTitle } = track.snippet;

    const imageUrl = extractThumbnail(thumbnails);

    return (
      <Grid container={true} item={true} xs={12} key={track.id}>
        <Grid item={true} xs={2}>
          <Button onClick={this.handleOnTrackClick}>
            <img src={imageUrl} alt={title} className={classes.image} id="gridRowTrack" />
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
                {parseTitle(title)}
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
                {videoOwnerChannelTitle}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const TracksCards = React.memo<OuterProps>((props) => {
  const { setOpen, setTrack } = usePlayerContext();
  const classes = useYoutubeTracksStyles();
  const { setLoading } = useAppContext();

  return (
    <TracksCardsClass
      setLoading={setLoading}
      {...props}
      classes={classes}
      setPlayerOpen={setOpen}
      setPlayerTrack={setTrack}
    />
  );
});
