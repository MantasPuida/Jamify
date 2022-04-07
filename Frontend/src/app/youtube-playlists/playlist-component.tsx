/* eslint-disable react/no-unescaped-entities */
import * as React from "react";
import { Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import PlayCircleOutline from "mdi-material-ui/PlayCircleOutline";
import { Grid as SwiperGrid, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { useYoutubeTracksStyles, YoutubeTracksStyles } from "./playlist.styles";
import { TracksCards } from "./playlist-cards";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";
import "./styles.css";

type InnerProps = WithStyles<typeof YoutubeTracksStyles>;

type OuterProps = {
  shouldSetLoading: boolean;
};

type Props = OuterProps & InnerProps;

type TrackResponseType = gapi.client.youtube.PlaylistItemListResponse;

interface State {
  loading: boolean;
  attempts: number;
  tracks?: TrackResponseType;
}

class YoutubePlaylistsClass extends React.PureComponent<Props, State> {
  public state: State = { loading: true, attempts: 0 };

  private readonly maxAttempts: number = 20;

  constructor(props: Props) {
    super(props);

    this.fetchYoutubeTracks();
  }

  private fetchYoutubeTracks = () => {
    const { attempts } = this.state;
    const todaysHits = "RDCLAK5uy_nqRa4MZhGLlzdFysGGDQyuGA43aqJR8FQ";

    if (attempts >= this.maxAttempts) {
      this.setState({ loading: false, attempts: this.maxAttempts });
      return;
    }

    if (!gapi.client || !gapi.client.youtube || !gapi.client.youtube.playlistItems) {
      setTimeout(() => {
        this.setState((state) => ({ attempts: state.attempts + 1, loading: true }));
        this.fetchYoutubeTracks();
      }, 100);
    } else {
      gapi.client.youtube.playlistItems
        .list({
          playlistId: todaysHits,
          part: ["snippet"],
          maxResults: 999
        })
        .then((value) => {
          this.setState({
            tracks: value.result,
            loading: false
          });
        });
    }
  };

  public render(): React.ReactNode {
    const { classes, shouldSetLoading } = this.props;
    const { loading, tracks } = this.state;

    if (loading) {
      return <>loading</>;
    }

    if (!tracks || !tracks.items || tracks.items?.length === 0) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    return (
      <Grid container={true} item={true} xs={12} className={classes.youtubeTracksGrid}>
        <Grid container={true} item={true} xs={12}>
          <Grid item={true} xs={12}>
            <Typography fontSize={45} fontWeight={900} fontFamily="Poppins,sans-serif" color="white">
              Recommended Songs
            </Typography>
          </Grid>
          <Grid item={true}>
            <Typography fontSize={25} fontWeight={400} fontFamily="Poppins,sans-serif" color="white">
              Today's Hits
            </Typography>
          </Grid>
          <Grid item={true} style={{ paddingLeft: 8, marginTop: 6 }}>
            <PlayCircleOutline style={{ color: "#FF0000" }} />
          </Grid>
        </Grid>
        <Grid item={true} xs={12} style={{ marginRight: 200 }}>
          <Swiper
            slidesPerView={3}
            grid={{
              rows: 4
            }}
            className="mySwiper"
            centeredSlides={false}
            navigation={true}
            modules={[SwiperGrid, Navigation]}
            draggable={false}
            freeMode={false}
            grabCursor={false}
            noSwiping={true}
            style={{ maxWidth: "85%", marginLeft: -15, paddingLeft: 10 }}>
            {tracks.items.map((track) => (
              <SwiperSlide style={{ backgroundColor: "black" }} key={track.id}>
                <TracksCards track={track} shouldSetLoading={shouldSetLoading} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Grid>
      </Grid>
    );
  }
}

export const YoutubePlaylists = React.memo<OuterProps>((props) => {
  const classes = useYoutubeTracksStyles();

  return <YoutubePlaylistsClass {...props} classes={classes} />;
});
