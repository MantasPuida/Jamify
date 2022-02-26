import * as React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { YoutubeTracksStyles, useYoutubeTracksStyles } from "./playlist.styles";

import "./carousel-items.css";
import "./fontFamily.css";

interface OuterProps {
  track: gapi.client.youtube.PlaylistItem;
  trackIndex: number;
}

interface InnerProps extends WithStyles<typeof YoutubeTracksStyles> {}

type Props = InnerProps & OuterProps;

class TracksCardsClass extends React.PureComponent<Props> {
  private parseTitle = (title: string): string => {
    if (title.endsWith("]")) {
      const regexBrackets: RegExp = /\[.*?\]/g;
      return title.replaceAll(regexBrackets, "");
    }

    if (title.endsWith(")")) {
      const regexParentheses: RegExp = /\(.*\)/g;
      return title.replaceAll(regexParentheses, "");
    }

    return title;
  };

  public render(): React.ReactNode {
    const { track, classes } = this.props;

    if (!track.id || !track.snippet || !track.snippet.thumbnails || !track.snippet.title) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    const { title, thumbnails, videoOwnerChannelTitle } = track.snippet;

    // const isIndexEven: boolean = trackIndex % 2 === 0;

    let imageUrl: string | undefined = thumbnails.default?.url;

    if (thumbnails.maxres) {
      const { maxres } = thumbnails;
      if (maxres.url) {
        imageUrl = maxres.url;
      }
    } else if (thumbnails.standard) {
      const { standard } = thumbnails;
      if (standard.url) {
        imageUrl = standard.url;
      }
    } else if (thumbnails.high) {
      const { high } = thumbnails;
      if (high.url) {
        imageUrl = high.url;
      }
    }

    return (
      <Grid container={true} item={true} xs={12} key={track.id}>
        <Grid item={true} xs={2}>
          <Button>
            <div className="tint-img">
              <img src={imageUrl} alt={title} className={classes.image} />
            </div>
          </Button>
        </Grid>
        <Grid container={true} item={true} xs={10} style={{ textAlign: "left" }}>
          <Grid item={true} xs={10}>
            <Button
              style={{
                textAlign: "left",
                textTransform: "none",
                justifyContent: "left",
                maxWidth: 425,
                paddingTop: 4,
                paddingBottom: 2
              }}
            >
              <Typography className={classes.typography} fontFamily="Poppins,sans-serif" fontSize={16} color="white">
                {this.parseTitle(title)}
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
                paddingTop: 0
              }}
            >
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
  const classes = useYoutubeTracksStyles();

  return <TracksCardsClass {...props} classes={classes} />;
});
