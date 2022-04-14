/* eslint-disable react/no-unescaped-entities */
import * as React from "react";
import { Grid, Tab, Tabs, TabsProps, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { useLocation } from "react-router";
import { FaDeezer } from "react-icons/fa";
import { DeezerStyles, useDeezerStyles } from "./deezer.styles";
import { ChartResponse } from "../../../types/deezer.types";
import { ArtistCards } from "./artist-cards";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";
import { TabPanel } from "../featured-playlists/tabs-panels";

interface InnerProps extends WithStyles<typeof DeezerStyles> {
  chartResponse?: ChartResponse;
}

interface State {
  value: number;
}

class DeezerArtistsClass extends React.PureComponent<InnerProps, State> {
  public state: State = { value: 2 };

  private handleChange: TabsProps["onChange"] = (event, newValue) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({ value: newValue });
  };

  private a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }

  public render(): React.ReactNode {
    const { classes, chartResponse } = this.props;
    const { value } = this.state;

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
                  backgroundImage: "linear-gradient(to left, #43C6AC, #191654)"
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
              {chartResponse?.artists.data.map((artist) => {
                if (artist.name === "Justinas Jarutis" || artist.name === "Andrius Mamontovas") {
                  return null;
                }

                if (artist.picture_xl && artist.id) {
                  return (
                    <SwiperSlide style={{ backgroundColor: "black" }} key={artist.id}>
                      <ArtistCards artist={artist} />
                    </SwiperSlide>
                  );
                }

                // eslint-disable-next-line react/jsx-no-useless-fragment
                return <></>;
              })}
            </Swiper>
          </TabPanel>
        </Grid>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={0}>
          Item Three
        </TabPanel>
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
      setChartResponse(response as ChartResponse);
    });
  }, [location]);

  return <DeezerArtistsClass chartResponse={chartResponse} classes={classes} />;
});
