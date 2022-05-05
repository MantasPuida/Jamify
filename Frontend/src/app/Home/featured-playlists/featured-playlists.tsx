import * as React from "react";
import axios from "axios";
import { NavigateFunction, useLocation, useNavigate } from "react-router";
import { Grid as SwiperGrid, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import SpotifyWebApi from "spotify-web-api-node";
import { WithStyles } from "@mui/styles";
import { Grid, Typography, Tabs, Tab, TabsProps, Skeleton } from "@mui/material";
import Spotify from "mdi-material-ui/Spotify";
import { FeaturedPlaylistsStyles, useFeaturedPlaylistsStyles } from "./featured.styles";
import { useSpotifyAuth } from "../../../context/spotify-context";
import { FeaturedCard } from "./featured-card";
import { TabPanel } from "./tabs-panels";
import { FeaturedTracks } from "./featured-tracks";
import { RecommendationsObject } from "../../../types/spotify.types";
import { BackdropLoader } from "../../loader/loader-backdrop";
import { FeaturedArtists } from "./featured-artists";

import "swiper/css";
import "swiper/css/navigation";
import "./styles.css";

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

  componentWillUnmount() {
    this.setState({ loading: false });
  }

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
      <Grid container={true} item={true} xs={12} className={classes.featuredPlaylistsGrid}>
        <Grid container={true} item={true} xs={12}>
          <Grid item={true} xs={12}>
            <Typography className={classes.featuredPlaylistsTitle} fontFamily="Poppins,sans-serif" color="white">
              Featured {normalizedText}
            </Typography>
          </Grid>
          <Grid item={true}>
            <Typography
              data-testid="featured-playlists-message"
              fontSize={25}
              fontWeight={400}
              fontFamily="Poppins,sans-serif"
              color="white"
              style={{ float: "left", paddingBottom: 16 }}>
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
              slidesPerGroup={4}
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
              style={{ maxWidth: "85%", marginTop: loading ? -24 : 0, marginLeft: -20, paddingLeft: 15 }}>
              {playlists.items.map((x) => (
                <SwiperSlide style={{ backgroundColor: "black" }} key={x.id}>
                  <>
                    {loading && (
                      <Grid container={true} item={true} xs={12} style={{ marginRight: 50 }}>
                        <Skeleton sx={{ bgcolor: "grey.900", width: 330, height: 330 }} />
                        <Skeleton sx={{ bgcolor: "grey.900", marginTop: -4 }} width="60%" />
                      </Grid>
                    )}
                    <FeaturedCard
                      playlist={x}
                      loading={loading}
                      shouldSetLoading={shouldSetLoading}
                      changeState={this.changeLoadingState}
                    />
                  </>
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
              slidesPerGroup={3}
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
                  <>
                    {loading && (
                      <Grid container={true} item={true} xs={12} key={track.id}>
                        <Grid item={true} xs={2}>
                          <Skeleton sx={{ bgcolor: "grey.900", width: 96, height: 96 }} />
                        </Grid>
                        <Grid container={true} item={true} xs={10} style={{ textAlign: "left" }}>
                          <Grid item={true} xs={10}>
                            <Typography
                              style={{ marginLeft: 24, marginTop: 22 }}
                              fontFamily="Poppins,sans-serif"
                              fontSize={16}
                              color="white">
                              <Skeleton sx={{ bgcolor: "grey.900" }} width={240} />
                            </Typography>
                          </Grid>
                          <Grid item={true} xs={10}>
                            <Typography
                              style={{ marginLeft: 24, marginTop: -12 }}
                              fontFamily="Poppins,sans-serif"
                              fontSize={16}
                              color="white">
                              <Skeleton sx={{ bgcolor: "grey.900" }} width={240} />
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                    <FeaturedTracks
                      track={track}
                      loading={loading}
                      shouldSetLoading={shouldSetLoading}
                      changeState={this.changeLoadingState}
                    />
                  </>
                </SwiperSlide>
              ))}
            </Swiper>
          </TabPanel>
        </Grid>
        <Grid item={true} xs={12} style={{ marginRight: 200, maxHeight: 200 }}>
          <TabPanel value={value} index={2}>
            <Swiper
              slidesPerView={8}
              slidesPerGroup={4}
              className="mySwiper"
              id="my-custom-identifier-spotify-artists"
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
                  slidesPerView: 5
                },
                1024: {
                  slidesPerView: 8
                },
                1980: {
                  slidesPerView: 7
                }
              }}
              modules={[Navigation]}
              style={{ maxWidth: "85%", marginLeft: -20, paddingLeft: 15 }}>
              {featuredArtists.artists.map((artist) => (
                <SwiperSlide style={{ backgroundColor: "black" }} key={artist.id}>
                  <>
                    {loading && (
                      <Grid container={true} item={true} xs={12} style={{ marginRight: 50 }}>
                        <Skeleton variant="circular" sx={{ bgcolor: "grey.900", width: 160, height: 160 }} />
                        <Skeleton sx={{ bgcolor: "grey.900", marginTop: 1, marginLeft: "18px" }} width="60%" />
                      </Grid>
                    )}
                    <FeaturedArtists loading={loading} artist={artist} changeState={this.changeLoadingState} />
                  </>
                </SwiperSlide>
              ))}
            </Swiper>
          </TabPanel>
        </Grid>
      </Grid>
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
          setTimeout(async () => {
            const apiUrl =
              "https://api.spotify.com/v1/recommendations?seed_artists=7dGJo4pcD2V6oG8kP0tJRR,4dpARuHxo51G3z768sgnrY,&seed_tracks=0c6xIDDpzE81m2q797ordA&market=ES&limit=50";

            try {
              const tracksResponse = await axios.get(apiUrl, {
                headers: {
                  Authorization: `Bearer ${spotifyToken}`
                }
              });

              setFeaturedTracks(tracksResponse.data as RecommendationsObject);
              setTimeout(async () => {
                const artists = tracksResponse.data.tracks.map((track) => track.artists[0].id);

                await spotifyApi.getArtists(artists).then((artistsResponse) => {
                  setFeaturedArtists(artistsResponse.body);
                });
              }, 1000);
            } catch (error) {
              logout();
            }
          }, 1000);
        });
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
