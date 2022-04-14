/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unescaped-entities */
import * as React from "react";
import { Grid, Tab, Tabs, Typography, TabsProps } from "@mui/material";
import { WithStyles } from "@mui/styles";
import PlayCircleOutline from "mdi-material-ui/PlayCircleOutline";
import { Grid as SwiperGrid, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { useYoutubeTracksStyles, YoutubeTracksStyles } from "./playlist.styles";
import { TracksCards } from "./playlist-cards";
import { useAppContext } from "../../context/app-context";
import { BackdropLoader } from "../loader/loader-backdrop";
import { TabPanel } from "../Home/featured-playlists/tabs-panels";
import { YoutubePlaylistsCards } from "./playlist-playlists";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";
import "./styles.css";
import { PlaylistArtists } from "./playlist-artists";

interface InnerProps extends WithStyles<typeof YoutubeTracksStyles> {
  setLoading: Function;
}

interface OuterProps {
  shouldSetLoading: boolean;
}

type Props = OuterProps & InnerProps;

type TrackResponseType = gapi.client.youtube.PlaylistItemListResponse;

interface State {
  loading: boolean;
  attempts: number;
  tracks?: TrackResponseType;
  playlists?: gapi.client.youtube.PlaylistListResponse;
  artists?: gapi.client.youtube.ChannelListResponse;
  value: number;
}

class YoutubePlaylistsClass extends React.PureComponent<Props, State> {
  public state: State;

  private readonly maxAttempts: number = 20;

  constructor(props: Props) {
    super(props);

    this.state = { loading: true, attempts: 0, value: 1 };
    this.fetchYoutubeTracks();
  }

  private fetchYoutubeTracks = async () => {
    const { attempts } = this.state;
    const todaysHits = "RDCLAK5uy_lqkZ7XVUPH7IZbFwDY6zkjEM6nSCiov0E";

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
      await gapi.client.youtube.playlistItems
        .list({
          playlistId: todaysHits,
          part: ["snippet"],
          maxResults: 999
        })
        .then((value) => {
          this.setState({
            tracks: value.result
          });
        });

      await gapi.client.youtube.playlists
        .list({
          part: "snippet",
          maxResults: 999,
          id: [
            "RDCLAK5uy_nqRa4MZhGLlzdFysGGDQyuGA43aqJR8FQ",
            "RDCLAK5uy_lqkZ7XVUPH7IZbFwDY6zkjEM6nSCiov0E",
            "RDCLAK5uy_nXBBem-7scP1sgqoSenilrZSCs68DpbrQ",
            "RDCLAK5uy_mlGRriVQjPo4T2tRhAwZpfmHqg1rIe9EY",
            "RDCLAK5uy_n534nXFf_diA4HxDxks_vcBBXNyBz0TIA",
            "RDCLAK5uy_lJ8xZWiZj2GCw7MArjakb6b0zfvqwldps",
            "RDCLAK5uy_lqNm3KZ4SvTuiGHhnvuep0z2CwMS0OyL4",
            "RDCLAK5uy_l4QirOJJ99DTK5t5h7PdS_apsSClRfPpc",
            "RDCLAK5uy_k5vcGRXixxemtzK1eKDS7BeHys7mvYOdk",
            "RDCLAK5uy_kLwgLlrxA4-_EchctXgTyHR4rwRaRv1wk",
            "RDCLAK5uy_m0Nsi5Jnn_g6qbvc7fywPRhEv1qN0PcMM",
            "RDCLAK5uy_nOwL35BM_GUTEbdbw_9FmvQhPWWdd3sAg",
            "RDCLAK5uy_kgq15xjENxUuOZNY3PFZhM_FcQjvwZn28",
            "RDCLAK5uy_lBGRuQnsG37Akr1CY4SxL0VWFbPrbO4gs",
            "RDCLAK5uy_k4QxtdDiyPtN17wezA186nbXuqO36QOiU",
            "RDCLAK5uy_nHSqCJjDrW9HBhCNdF6tWPdnOMngOv0wA",
            "RDCLAK5uy_nBQm8_YpP--R6zU8p3dypKm1QKqzWY6qU"
          ]
        })
        .then((response) => {
          this.setState({
            playlists: response.result
          });
        });

      await gapi.client.youtube.channels
        .list({
          part: ["snippet"],
          id: [
            "UCEuOwB9vSL1oPKGNdONB4ig",
            "UCZFWPqqPkFlNwIxcpsLOwew",
            "UCzpl23pGTHVYqvKsgY0A-_w",
            "UC0C-w0YjGpqDXGB8IHb662A",
            "UCy3zgWom-5AGypGX_FVTKpg",
            "UC0WP5P-ufpRfjbNrmOWwLBQ",
            "UCzIyoPv6j1MAZpDHKLGP_eA",
            "UCsdXkstc8jFC3zpMYdEz_zA",
            "UCByOQJjav0CUDwxCk-jVNRQ",
            "UCOSIXyYdT93OzpRnAuWaKjQ",
            "UCIwFjwMjI0y7PDBVEO9-bkQ",
            "UCr7r9JorcxMDOC5ZQ_ZCs3w",
            "Bruno Mars",
            "UCaxOQZrF5llUMp-JjesUz1A",
            "UC-J-KZfRV8c13fOCkhXdLiQ",
            "UCsRM0YB_dabtEPGPTKo-gcw",
            "UC_uMv3bNXwapHl8Dzf2p01Q"
          ],
          maxResults: 999
        })
        .then((response) => {
          this.setState({
            artists: response.result,
            loading: false
          });
        });
    }
  };

  private changeLoadingState = () => {
    this.setState({ loading: false });
  };

  private handleChange: TabsProps["onChange"] = (event, newValue) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({ value: newValue, loading: true });
  };

  private a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }

  public render(): React.ReactNode {
    const { classes, shouldSetLoading } = this.props;
    const { loading, tracks, value, playlists, artists } = this.state;

    if (
      !tracks ||
      !tracks.items ||
      tracks.items?.length === 0 ||
      !playlists ||
      !playlists.items ||
      playlists.items?.length === 0 ||
      !artists ||
      !artists.items ||
      artists.items?.length === 0
    ) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    let normalizedText = "";

    if (value === 0) {
      normalizedText = "Playlists";
    } else if (value === 1) {
      normalizedText = "Tracks";
    } else {
      normalizedText = "Artists";
    }

    return (
      <>
        {loading && <BackdropLoader />}
        <Grid container={true} item={true} xs={12} className={classes.youtubeTracksGrid}>
          <Grid container={true} item={true} xs={12}>
            <Grid item={true} xs={12}>
              <Typography fontSize={45} fontWeight={900} fontFamily="Poppins,sans-serif" color="white">
                Recommended {normalizedText}
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
            <Grid item={true} style={{ marginTop: -16, paddingLeft: 16 }}>
              <Tabs
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "#FF0000"
                  }
                }}
                value={value}
                onChange={this.handleChange}>
                <Tab
                  classes={{
                    root: classes.tabRootStyles
                  }}
                  label={<span style={{ color: "white" }}>Playlists</span>}
                  {...this.a11yProps(0)}
                />
                <Tab
                  classes={{
                    root: classes.tabRootStyles
                  }}
                  label={<span style={{ color: "white" }}>Tracks</span>}
                  {...this.a11yProps(1)}
                />
                <Tab
                  classes={{
                    root: classes.tabRootStyles
                  }}
                  label={<span style={{ color: "white" }}>Artists</span>}
                  {...this.a11yProps(2)}
                />
              </Tabs>
            </Grid>
          </Grid>
          <Grid item={true} xs={12} style={{ marginRight: 200 }}>
            <TabPanel value={value} index={1}>
              <Swiper
                slidesPerView={4}
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
                    <TracksCards
                      track={track}
                      shouldSetLoading={shouldSetLoading}
                      changeLoading={this.changeLoadingState}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </TabPanel>
          </Grid>
          <Grid item={true} xs={12} style={{ marginRight: 200 }}>
            <TabPanel value={value} index={0}>
              <Swiper
                slidesPerView={5}
                className="mySwiper"
                centeredSlides={false}
                navigation={true}
                breakpoints={{
                  0: {
                    slidesPerView: 2
                  },
                  300: {
                    slidesPerView: 3
                  },
                  768: {
                    slidesPerView: 4
                  },
                  1024: {
                    slidesPerView: 5
                  }
                }}
                modules={[Navigation]}
                style={{ maxWidth: "85%", marginLeft: -20, paddingLeft: 15 }}>
                {playlists.items.map((x) => (
                  <SwiperSlide style={{ backgroundColor: "black" }} key={x.id}>
                    <YoutubePlaylistsCards
                      playlist={x}
                      shouldSetLoading={shouldSetLoading}
                      changeLoading={this.changeLoadingState}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </TabPanel>
          </Grid>
          <Grid item={true} xs={12} style={{ marginRight: 200 }}>
            <TabPanel value={value} index={2}>
              <Swiper
                slidesPerView={6}
                className="mySwiper"
                centeredSlides={false}
                navigation={true}
                breakpoints={{
                  0: {
                    slidesPerView: 2
                  },
                  300: {
                    slidesPerView: 0
                  },
                  768: {
                    slidesPerView: 5
                  },
                  1024: {
                    slidesPerView: 6
                  }
                }}
                modules={[Navigation]}
                style={{ maxWidth: "85%", marginLeft: -20 }}>
                {artists.items.map((artist) => (
                  <SwiperSlide style={{ backgroundColor: "black" }} key={artist.id}>
                    <PlaylistArtists artist={artist} changeLoading={this.changeLoadingState} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </TabPanel>
          </Grid>
        </Grid>
      </>
    );
  }
}

export const YoutubePlaylists = React.memo<OuterProps>((props) => {
  const classes = useYoutubeTracksStyles();
  const { setLoading } = useAppContext();

  return <YoutubePlaylistsClass setLoading={setLoading} {...props} classes={classes} />;
});
