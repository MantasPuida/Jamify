/* eslint-disable react/no-unescaped-entities */
import * as React from "react";
import { Grid, Skeleton, Tab, Tabs, TabsProps, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { Grid as SwiperGrid, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { useLocation } from "react-router";
import { FaDeezer } from "react-icons/fa";
import { DeezerStyles, useDeezerStyles } from "./deezer.styles";
import { ChartResponse } from "../../../types/deezer.types";
import { ArtistCards } from "./artist-cards";
import { TabPanel } from "../featured-playlists/tabs-panels";
import { DeezerPlaylists } from "./deezer-playlists";
import { DeezerTracks } from "./deezer-tracks";

import "./styles.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";
import { Notify } from "../../notification/notification-component";

interface InnerProps extends WithStyles<typeof DeezerStyles> {
  chartResponse?: ChartResponse;
}

interface State {
  value: number;
  loading: boolean;
}

class DeezerArtistsClass extends React.PureComponent<InnerProps, State> {
  public state: State = { value: 2, loading: false };

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
    const { classes, chartResponse } = this.props;
    const { value, loading } = this.state;

    let normalizedText = "";

    if (value === 0) {
      normalizedText = "Playlists";
    } else if (value === 1) {
      normalizedText = "Tracks";
    } else {
      normalizedText = "Artists";
    }

    return (
      <Grid container={true} item={true} xs={12} className={classes.deezerGrid}>
        <Grid container={true} item={true} xs={12}>
          <Grid item={true} xs={12}>
            <Typography className={classes.artistTitle} fontFamily="Poppins,sans-serif" color="white">
              Top {normalizedText}
            </Typography>
          </Grid>
          <Grid item={true}>
            <Typography className={classes.artistHelperTitle} fontFamily="Poppins,sans-serif" color="white">
              Most-streamed artists
            </Typography>
          </Grid>
          <Grid item={true} style={{ paddingLeft: 8, marginTop: 6 }}>
            <FaDeezer style={{ width: 24, height: 24, color: "white" }} />
          </Grid>
          <Grid item={true} style={{ marginTop: -16, paddingLeft: 16 }}>
            <Tabs
              TabIndicatorProps={{
                style: {
                  color: "#191654"
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
          <TabPanel value={value} index={2}>
            <Swiper
              slidesPerView={8}
              className="mySwiper"
              id="my-custom-identifier-artists"
              centeredSlides={false}
              slidesPerGroup={4}
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
                  slidesPerView: 6
                },
                1366: {
                  slidesPerView: 6
                },
                2080: {
                  slidesPerView: 8
                }
              }}
              modules={[Navigation]}
              style={{ maxWidth: "85%", marginLeft: -20 }}>
              {chartResponse?.artists.data.map((artist) => {
                if (artist.name === "Justinas Jarutis" || artist.name === "Andrius Mamontovas") {
                  return null;
                }

                if (artist.picture_xl && artist.id) {
                  return (
                    <SwiperSlide style={{ backgroundColor: "black" }} key={artist.id}>
                      <>
                        {loading && (
                          <Grid container={true} item={true} xs={12} style={{ marginRight: 50 }}>
                            <Skeleton variant="circular" sx={{ bgcolor: "grey.900", width: 160, height: 160 }} />
                            <Skeleton sx={{ bgcolor: "grey.900", marginTop: 1, marginLeft: "18px" }} width="60%" />
                          </Grid>
                        )}
                        <ArtistCards loading={loading} artist={artist} changeState={this.changeLoadingState} />
                      </>
                    </SwiperSlide>
                  );
                }

                // eslint-disable-next-line react/jsx-no-useless-fragment
                return <></>;
              })}
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
              id="my-custom-identifier-tracks"
              centeredSlides={false}
              slidesPerGroup={3}
              navigation={true}
              modules={[SwiperGrid, Navigation]}
              draggable={false}
              freeMode={false}
              grabCursor={false}
              noSwiping={true}
              style={{ maxWidth: "85%", marginLeft: -15, paddingLeft: 10 }}>
              {chartResponse?.tracks.data.map((track) => (
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
                    <DeezerTracks loading={loading} track={track} changeState={this.changeLoadingState} />
                  </>
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
              id="my-custom-identifier-playlists"
              centeredSlides={false}
              slidesPerGroup={4}
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
              {chartResponse?.playlists.data.map((x) => (
                <SwiperSlide style={{ backgroundColor: "black" }} key={x.id}>
                  <>
                    {loading && (
                      <Grid container={true} item={true} xs={12} style={{ marginRight: 50 }}>
                        <Skeleton sx={{ bgcolor: "grey.900", width: 330, height: 330 }} />
                        <Skeleton sx={{ bgcolor: "grey.900", marginTop: -4 }} width="60%" />
                      </Grid>
                    )}
                    <DeezerPlaylists loading={loading} playlist={x} changeState={this.changeLoadingState} />
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

export const DeezerArtists = React.memo(() => {
  const [chartResponse, setChartResponse] = React.useState<ChartResponse>();
  const classes = useDeezerStyles();
  const location = useLocation();

  React.useEffect(() => {
    DZ.api("/chart?limit=40", (response) => {
      if (response.error && response.error.message) {
        Notify(response.error.message, "error");
      } else {
        setChartResponse(response as ChartResponse);
      }
    });
  }, [location]);

  return <DeezerArtistsClass chartResponse={chartResponse} classes={classes} />;
});
