/* eslint-disable react/no-unescaped-entities */
import { Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import * as React from "react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { useYoutubeTracksStyles, YoutubeTracksStyles } from "./playlist.styles";

import "swiper/css";
import "swiper/css/navigation";
import "./styles.css";
import { TracksCards } from "./playlist-cards";

type InnerProps = WithStyles<typeof YoutubeTracksStyles>;

type TrackResponseType = gapi.client.youtube.PlaylistItemListResponse;

interface State {
  loading: boolean;
  attempts: number;
  tracks?: TrackResponseType;
}

class YoutubePlaylistsClass extends React.PureComponent<InnerProps, State> {
  public state: State = { loading: true, attempts: 0 };

  private readonly maxAttempts: number = 20;

  constructor(props: InnerProps) {
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
          maxResults: 200
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
    const { classes } = this.props;
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
        <Grid item={true} xs={12}>
          <Typography fontSize={45} fontWeight={900} fontFamily="Poppins,sans-serif" color="white">
            Recommended Songs
          </Typography>
          <Typography fontSize={25} fontWeight={400} fontFamily="Poppins,sans-serif" color="white">
            Today's Hits
          </Typography>
        </Grid>
        <Grid item={true} xs={12}>
          <Swiper
            slidesPerView={5}
            className="mySwiper"
            centeredSlides={false}
            navigation={true}
            modules={[Navigation]}
            style={{ maxWidth: "85%", marginLeft: -20, paddingLeft: 15 }}
          >
            {tracks.items.map((track) => (
              <SwiperSlide style={{ backgroundColor: "black" }} key={track.id}>
                <TracksCards track={track} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Grid>
      </Grid>
    );
  }
}

export const YoutubePlaylists = React.memo(() => {
  const classes = useYoutubeTracksStyles();
  //   const location = useLocation();
  //   const todaysHits = "RDCLAK5uy_nqRa4MZhGLlzdFysGGDQyuGA43aqJR8FQ";

  //   React.useEffect(() => {
  //     gapi.client.youtube.playlistItems
  //       .list({ playlistId: todaysHits, part: "snippet", maxResults: 200 })
  //       .then((value) => {
  //         console.log(value);
  //       });
  //   }, [location.pathname]);

  return <YoutubePlaylistsClass classes={classes} />;
});
