/* eslint-disable react/no-unescaped-entities */
import * as React from "react";
import { Avatar, Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { useLocation } from "react-router";
import { DeezerStyles, useDeezerStyles } from "./deezer.styles";
import DeezerLogo from "../../../assets/svg/deezer-logo.svg";
import { ChartResponse } from "../../../types/deezer.types";
import { ArtistCards } from "./artist-cards";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";

interface InnerProps extends WithStyles<typeof DeezerStyles> {
  chartResponse?: ChartResponse;
}

class DeezerArtistsClass extends React.PureComponent<InnerProps> {
  public render(): React.ReactNode {
    const { classes, chartResponse } = this.props;

    return (
      <Grid container={true} item={true} xs={12} className={classes.deezerGrid}>
        <Grid container={true} item={true} xs={12}>
          <Grid item={true} xs={12}>
            <Typography className={classes.artistTitle} fontFamily="Poppins,sans-serif" color="white">
              Top Artists
            </Typography>
          </Grid>
          <Grid item={true}>
            <Typography className={classes.artistHelperTitle} fontFamily="Poppins,sans-serif" color="white">
              Today's Most-streamed artists
            </Typography>
          </Grid>
          <Grid item={true} style={{ paddingLeft: 8, marginTop: 6 }}>
            <Avatar src={DeezerLogo} style={{ backgroundColor: "white", width: 24, height: 24 }} />
          </Grid>
        </Grid>
        <Grid item={true} xs={12} style={{ marginRight: 200 }}>
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
      setChartResponse(response as ChartResponse);
    });
  }, [location]);

  return <DeezerArtistsClass chartResponse={chartResponse} classes={classes} />;
});
