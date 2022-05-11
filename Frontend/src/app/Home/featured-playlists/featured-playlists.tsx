import * as React from "react";
import axios from "axios";
import { NavigateFunction, useNavigate } from "react-router";
import { Grid as SwiperGrid, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import TopBar from "react-topbar-progress-indicator";
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
  navigate: NavigateFunction;
  spotifyToken: string | null;
  logout: Function;
}

type Props = OuterProps & InnerProps;

interface State {
  value: number;
  loading: boolean;
  featuredPlaylists?: FeaturedPlaylist;
  featuredTracks?: RecommendationsObject;
  featuredArtists?: SpotifyApi.MultipleArtistsResponse;
}

class FeaturedPlaylistsClass extends React.PureComponent<Props, State> {
  public state: State = { value: 0, loading: false };

  constructor(props: Props) {
    super(props);

    const { featuredArtists, featuredPlaylists, featuredTracks } = this.state;
    if (!featuredPlaylists) {
      this.fetchPlaylists(props);
    }
    if (!featuredTracks) {
      this.fetchTracks(props);
    }
    if (!featuredArtists) {
      this.fetchArtists(props);
    }
  }

  componentWillUnmount() {
    this.setState({ loading: false });
  }

  private fetchPlaylists = (props: Props) => {
    const { spotifyToken, spotifyApi, logout } = props;
    if (spotifyToken) {
      spotifyApi
        .getFeaturedPlaylists({
          locale: "en"
        })
        .then((value) => {
          this.setState({ featuredPlaylists: value.body, loading: false });
        })
        .catch(() => {
          this.setState({ loading: false });
          logout();
        });
    }
  };

  private fetchTracks = (props: Props) => {
    const { spotifyToken, logout } = props;

    if (!spotifyToken) {
      return;
    }

    const apiUrl =
      "https://api.spotify.com/v1/recommendations?seed_artists=7dGJo4pcD2V6oG8kP0tJRR,4dpARuHxo51G3z768sgnrY,&seed_tracks=0c6xIDDpzE81m2q797ordA&market=ES&limit=50";

    try {
      const tracksResponse = axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${spotifyToken}`
        }
      });

      tracksResponse.then((response) => {
        this.setState({ featuredTracks: response.data as RecommendationsObject, loading: false });
      });
    } catch (error) {
      logout();
    }
  };

  private fetchArtists = (props: Props) => {
    const { spotifyToken, logout, spotifyApi } = props;
    const { featuredTracks } = this.state;

    if (!spotifyToken) {
      return;
    }

    if (featuredTracks) {
      const artists = featuredTracks.tracks.map((track) => track.artists[0].id);

      spotifyApi
        .getArtists(artists)
        .then((artistsResponse) => {
          this.setState({ featuredArtists: artistsResponse.body, loading: false });
        })
        .catch(() => {
          logout();
        });
    }
  };

  private handleChange: TabsProps["onChange"] = (event, newValue) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({ value: newValue, loading: true });

    const { featuredPlaylists, featuredArtists, featuredTracks } = this.state;

    if (newValue === 0 && !featuredPlaylists) {
      this.fetchPlaylists(this.props);
    }

    if (newValue === 1 && !featuredTracks) {
      this.fetchTracks(this.props);
    }

    if (newValue === 2 && !featuredArtists) {
      this.fetchArtists(this.props);
    }
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
    const { classes, shouldSetLoading } = this.props;
    const { value, loading, featuredPlaylists, featuredArtists, featuredTracks } = this.state;

    if (!featuredPlaylists) {
      return <TopBar />;
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
                  <FeaturedCard
                    playlist={x}
                    loading={loading}
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
              slidesPerGroup={3}
              centeredSlides={false}
              navigation={true}
              modules={[SwiperGrid, Navigation]}
              draggable={false}
              freeMode={false}
              grabCursor={false}
              noSwiping={true}
              style={{ maxWidth: "85%", marginLeft: -15, paddingLeft: 10 }}>
              {featuredTracks &&
                featuredTracks.tracks &&
                featuredTracks.tracks.length > 0 &&
                featuredTracks.tracks.map((track) => (
                  <SwiperSlide style={{ backgroundColor: "black" }} key={track.id}>
                    <FeaturedTracks
                      track={track}
                      loading={loading}
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
            {featuredArtists && featuredArtists.artists && featuredArtists.artists.length > 0 && (
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
                    <FeaturedArtists loading={loading} artist={artist} changeState={this.changeLoadingState} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </TabPanel>
        </Grid>
      </Grid>
    );
  }
}

export const FeaturedPlaylists = React.memo<OuterProps>((props) => {
  const classes = useFeaturedPlaylistsStyles();
  const { spotifyToken, logout } = useSpotifyAuth();
  const navigate = useNavigate();
  const { spotifyApi, shouldSetLoading } = props;

  return (
    <FeaturedPlaylistsClass
      classes={classes}
      spotifyToken={spotifyToken}
      logout={logout}
      navigate={navigate}
      spotifyApi={spotifyApi}
      shouldSetLoading={shouldSetLoading}
    />
  );
});
