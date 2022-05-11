import * as React from "react";
import { Button, ButtonProps, Grid, Grow, Typography } from "@mui/material";
import Play from "mdi-material-ui/Play";
import { useNavigate, NavigateFunction } from "react-router";
import { WithStyles } from "@mui/styles";
import { YoutubeTracksStyles, useYoutubeTracksStyles } from "./playlist.styles";
import { TrackObject, usePlayerContext } from "../../context/player-context";
import { parseTitle } from "../../helpers/title-parser";
import { extractThumbnail } from "../../helpers/thumbnails";
import { useAppContext } from "../../context/app-context";
import { AppRoutes } from "../routes/routes";

import "./fontFamily.css";

interface OuterProps {
  track: gapi.client.youtube.PlaylistItem;
  shouldSetLoading: boolean;
  changeLoading: () => void;
  loading: boolean;
}

interface InnerProps extends WithStyles<typeof YoutubeTracksStyles> {
  setPlayerOpen: Function;
  setPlayerTrack: Function;
  setLoading: Function;
  navigate: NavigateFunction;
}

type Props = InnerProps & OuterProps;

interface State {
  isImageLoading: boolean;
}

class TracksCardsClass extends React.PureComponent<Props, State> {
  public state: State = { isImageLoading: true };

  componentDidMount() {
    const { shouldSetLoading, setLoading, changeLoading } = this.props;

    if (shouldSetLoading) {
      setLoading(false);
    }

    changeLoading();
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

  private handleOnArtistClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate, track } = this.props;

    if (track.snippet?.videoOwnerChannelTitle) {
      const { videoOwnerChannelTitle } = track.snippet;

      DZ.api(`search?q=${videoOwnerChannelTitle}`, (response) => {
        const { data } = response;
        const filteredArtist = data.find(
          (value) => value.artist.type === "artist" && value.artist.name === videoOwnerChannelTitle
        );

        if (filteredArtist) {
          navigate(AppRoutes.Artist, {
            state: {
              artist: {
                ...filteredArtist.artist,
                picture_xl: filteredArtist.artist.picture_xl
              }
            }
          });
        } else {
          navigate(AppRoutes.Artist, { state: { artist: data[0].artist } });
        }
      });
    }
  };

  public render(): React.ReactNode {
    const { track, classes, loading } = this.props;
    const { isImageLoading } = this.state;

    if (loading) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    if (!track.id || !track.snippet || !track.snippet.thumbnails || !track.snippet.title) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    const { title, thumbnails, videoOwnerChannelTitle } = track.snippet;

    const imageUrl = extractThumbnail(thumbnails);

    return (
      <Grow in={!loading && !isImageLoading} style={{ transformOrigin: "0 0 0" }} {...{ timeout: 1000 }}>
        <Grid container={true} item={true} xs={12} key={track.id}>
          <Grid item={true} xs={4}>
            <Button onClick={this.handleOnTrackClick} style={{ width: 140 }}>
              {isImageLoading && <img src="" alt="dummy" className={classes.image} />}
              <img
                style={{ display: isImageLoading ? "none" : "block" }}
                onLoad={() => this.setState({ isImageLoading: false })}
                src={imageUrl}
                alt={title}
                className={classes.image}
                id="gridRowTrack"
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
                  {parseTitle(title)}
                </Typography>
              </Button>
            </Grid>
            <Grid item={true} xs={10} style={{ marginBottom: 12 }}>
              <Button
                onClick={this.handleOnArtistClick}
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
      </Grow>
    );
  }
}

export const TracksCards = React.memo<OuterProps>((props) => {
  const { setLoading } = useAppContext();
  const { setOpen, setTrack } = usePlayerContext();
  const classes = useYoutubeTracksStyles();
  const navigate = useNavigate();

  return (
    <TracksCardsClass
      {...props}
      navigate={navigate}
      setLoading={setLoading}
      classes={classes}
      setPlayerOpen={setOpen}
      setPlayerTrack={setTrack}
    />
  );
});
