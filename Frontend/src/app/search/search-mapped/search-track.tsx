import * as React from "react";
import { Grid, Typography, ButtonProps, Button, Grow } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { SearchStyles } from "../search.styles";
import { usePlayerContext } from "../../../context/player-context";

import "../fontFamily.css";

interface OuterProps extends WithStyles<typeof SearchStyles> {
  track: SpotifyApi.TrackObjectFull;
}

interface InnerProps {
  setTrack: Function;
  setOpen: Function;
}

interface TrackObject {
  title: string;
  thumbnail: string;
  channelTitle: string;
  videoId: string;
}

type Props = OuterProps & InnerProps;

interface State {
  isImageLoading: boolean;
}

class SearchTrackClass extends React.PureComponent<Props, State> {
  public state: State = { isImageLoading: true };

  private handleOnClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { setTrack, setOpen, track } = this.props;

    gapi.client.youtube.search
      .list({
        part: "snippet",
        q: `${track.name} ${track.artists.join(", ")}`
      })
      .then((value) => {
        if (value.result.items && value.result.items[0].id?.videoId) {
          const trackObj: TrackObject = {
            channelTitle: track.album.name,
            title: track.name,
            thumbnail: track.album.images[0].url,
            videoId: value.result.items[0].id?.videoId
          };

          setTrack(trackObj);
          setOpen(true);
        }
      });
  };

  public render(): React.ReactNode {
    const { track, classes } = this.props;
    const { isImageLoading } = this.state;

    return (
      <Grow in={!isImageLoading} style={{ transformOrigin: "0 0 0" }} {...{ timeout: 800 }}>
        <Grid container={true}>
          <Grid container={true} item={true} xs={12} style={{ paddingRight: 32 }}>
            <Grid item={true} xs={12}>
              <Button style={{ padding: 0, color: "transparent" }} onClick={this.handleOnClick}>
                <div className="tint-img">
                  <img
                    src={track.album.images[0].url}
                    alt={track.album.name}
                    style={{ maxWidth: 160, maxHeight: 160, objectFit: "scale-down" }}
                    onLoad={() => this.setState({ isImageLoading: false })}
                  />
                </div>
              </Button>
            </Grid>
            <Grid item={true} xs={12}>
              <Button
                variant="text"
                style={{ padding: 0, color: "transparent", textTransform: "none" }}
                onClick={this.handleOnClick}>
                <Typography className={classes.typography} color="white">
                  {track.name}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grow>
    );
  }
}

export const SearchTrack = React.memo<OuterProps>((props) => {
  const { setTrack, setOpen } = usePlayerContext();

  return <SearchTrackClass setTrack={setTrack} setOpen={setOpen} {...props} />;
});
