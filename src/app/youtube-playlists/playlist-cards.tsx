import * as React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { YoutubeTracksStyles, useYoutubeTracksStyles } from "./playlist.styles";

import "./carousel-items.css";

interface OuterProps {
  track: gapi.client.youtube.PlaylistItem;
}

interface InnerProps extends WithStyles<typeof YoutubeTracksStyles> {}

type Props = InnerProps & OuterProps;

class TracksCardsClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { track, classes } = this.props;

    if (!track.id || !track.snippet || !track.snippet.thumbnails || !track.snippet.title) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    const { title, thumbnails } = track.snippet;

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
        <Grid container={true} item={true} xs={12} style={{ marginRight: 50 }}>
          <Grid item={true}>
            <Button>
              <div className="tint-img">
                <img src={imageUrl} alt={title} className={classes.image} />
              </div>
            </Button>
          </Grid>
          <Grid item={true}>
            <Button>
              <Typography fontFamily="Poppins,sans-serif" color="white">
                {title}
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
