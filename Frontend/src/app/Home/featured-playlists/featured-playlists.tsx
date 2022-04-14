import * as React from "react";
import axios from "axios";
import { NavigateFunction, useLocation, useNavigate } from "react-router";
import { Grid as SwiperGrid, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import SpotifyWebApi from "spotify-web-api-node";
import { WithStyles } from "@mui/styles";
import { Grid, Typography, Tabs, Tab, TabsProps } from "@mui/material";
import Spotify from "mdi-material-ui/Spotify";
import { FeaturedPlaylistsStyles, useFeaturedPlaylistsStyles } from "./featured.styles";
import { useSpotifyAuth } from "../../../context/spotify-context";
import { FeaturedCard } from "./featured-card";
import { TabPanel } from "./tabs-panels";
import { FeaturedTracks } from "./featured-tracks";
import { RecommendationsObject } from "../../../types/spotify.types";
import { BackdropLoader } from "../../loader/loader-backdrop";

import "swiper/css";
import "swiper/css/navigation";
import "./styles.css";
import { FeaturedArtists } from "./featured-artists";

interface OuterProps {
  spotifyApi: SpotifyWebApi;
  shouldSetLoading: boolean;
}

type FeaturedPlaylist = SpotifyApi.ListOfFeaturedPlaylistsResponse;

interface InnerProps extends WithStyles<typeof FeaturedPlaylistsStyles> {
  featuredPlaylists?: FeaturedPlaylist;
  featuredTracks?: RecommendationsObject;
  navigate: NavigateFunction;
  featuredArtists: SpotifyApi.MultipleArtistsResponse | undefined;
}

type Props = OuterProps & InnerProps;

interface State {
  value: number;
  loading: boolean;
}

class FeaturedPlaylistsClass extends React.PureComponent<Props, State> {
  public state: State = { value: 0, loading: false };

  private handleChange: TabsProps["onChange"] = (event, newValue) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({ value: newValue, loading: true });
  };

  private changeLoadingState = () => {
    this.setState({ loading: false });
  };

  private a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }

  public render(): React.ReactNode {
    const { classes, featuredPlaylists, shouldSetLoading, featuredTracks, featuredArtists } = this.props;
    const { value, loading } = this.state;

    if (!featuredPlaylists || !featuredTracks || !featuredArtists) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <BackdropLoader />;
    }

    const { message, playlists } = featuredPlaylists;

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
        <Grid container={true} item={true} xs={12} className={classes.featuredPlaylistsGrid}>
          <Grid container={true} item={true} xs={12}>
            <Grid item={true} xs={12}>
              <Typography className={classes.featuredPlaylistsTitle} fontFamily="Poppins,sans-serif" color="white">
                Featured {normalizedText}
              </Typography>
            </Grid>
            <Grid item={true}>
              <Typography
                fontSize={25}
                fontWeight={400}
                fontFamily="Poppins,sans-serif"
                color="white"
                style={{ float: "left" }}>
                {message ?? "Editor's picks"}
              </Typography>
            </Grid>
            <Grid item={true} style={{ paddingLeft: 8, marginTop: 6 }}>
              <Spotify style={{ color: "#1DB954" }} />
            </Grid>
            <Grid item={true} style={{ marginTop: -16, paddingLeft: 16 }}>
              <Tabs
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "#1DB954"
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
          <Grid item={true} xs={12}>
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
                    <FeaturedCard
                      playlist={x}
                      shouldSetLoading={shouldSetLoading}
                      changeState={this.changeLoadingState}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </TabPanel>
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
                {featuredTracks.tracks.map((track) => (
                  <SwiperSlide style={{ backgroundColor: "black" }} key={track.id}>
                    <FeaturedTracks
                      track={track}
                      shouldSetLoading={shouldSetLoading}
                      changeState={this.changeLoadingState}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </TabPanel>
          </Grid>
          <Grid item={true} xs={12} style={{ marginRight: 200, maxHeight: 200 }}>
            <TabPanel value={value} index={2}>
              <Swiper
                id="artist-custom-swiper"
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
                    slidesPerView: 7
                  }
                }}
                slideNextClass="id: myNextSlide"
                modules={[Navigation]}
                style={{ maxWidth: "85%", marginLeft: -20 }}>
                {featuredArtists.artists.map((artist) => (
                  <SwiperSlide style={{ backgroundColor: "black" }} key={artist.id}>
                    <FeaturedArtists artist={artist} changeState={this.changeLoadingState} />
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

export const FeaturedPlaylists = React.memo<OuterProps>((props) => {
  const classes = useFeaturedPlaylistsStyles();
  const { spotifyToken, logout } = useSpotifyAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [featuredPlaylists, setFeaturedPlaylists] = React.useState<undefined | FeaturedPlaylist>();
  const [featuredTracks, setFeaturedTracks] = React.useState<undefined | RecommendationsObject>();
  const [featuredArtists, setFeaturedArtists] = React.useState<undefined | SpotifyApi.MultipleArtistsResponse>();
  const { spotifyApi, shouldSetLoading } = props;

  React.useEffect(() => {
    if (spotifyToken) {
      spotifyApi
        .getFeaturedPlaylists({
          locale: "en"
        })
        .then((value) => {
          setFeaturedPlaylists(value.body);
        })
        .catch(() => {
          logout();
        });

      setTimeout(async () => {
        const apiUrl =
          "https://api.spotify.com/v1/recommendations?seed_artists=7dGJo4pcD2V6oG8kP0tJRR,4dpARuHxo51G3z768sgnrY,&seed_tracks=0c6xIDDpzE81m2q797ordA&market=ES&limit=50";

        if (featuredPlaylists) {
          try {
            const response = await axios.get(apiUrl, {
              headers: {
                Authorization: `Bearer ${spotifyToken}`
              }
            });

            setFeaturedTracks(response.data as RecommendationsObject);
          } catch (error) {
            logout();
          }
        }
      }, 1000);

      if (featuredTracks) {
        setTimeout(async () => {
          const artists = featuredTracks.tracks.map((track) => track.artists[0].id);

          await spotifyApi
            .getArtists(artists)
            .then((response) => {
              setFeaturedArtists(response.body);
            })
            .catch(() => {
              logout();
            });
        }, 1000);
      }
    }
  }, [location.pathname]);

  return (
    <FeaturedPlaylistsClass
      classes={classes}
      featuredTracks={featuredTracks}
      featuredArtists={featuredArtists}
      navigate={navigate}
      spotifyApi={spotifyApi}
      featuredPlaylists={featuredPlaylists}
      shouldSetLoading={shouldSetLoading}
    />
  );
});
