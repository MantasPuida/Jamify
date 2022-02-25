import * as React from "react";
import { NavigateFunction, useLocation, useNavigate } from "react-router";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import SpotifyWebApi from "spotify-web-api-node";
import { WithStyles } from "@mui/styles";
import { Grid, Typography } from "@mui/material";
import { FeaturedPlaylistsStyles, useFeaturedPlaylistsStyles } from "./featured.styles";
import { useSpotifyAuth } from "../../../context/spotify-context";
import { Notify } from "../../notification/notification-component";
import { FeaturedCard } from "./featured-card";

import "swiper/css";
import "swiper/css/navigation";
import "./styles.css";

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

type FeaturedPlaylist = SpotifyApi.ListOfFeaturedPlaylistsResponse;

interface InnerProps extends WithStyles<typeof FeaturedPlaylistsStyles> {
  featuredPlaylists?: FeaturedPlaylist;
  navigate: NavigateFunction;
}

type Props = OuterProps & InnerProps;

class FeaturedPlaylistsClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { classes, featuredPlaylists } = this.props;

    if (!featuredPlaylists) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    const { message, playlists } = featuredPlaylists;

    return (
      <Grid container={true} item={true} xs={12} className={classes.featuredPlaylistsGrid}>
        <Grid item={true} xs={12}>
          <Typography fontSize={45} fontWeight={900} fontFamily="Poppins,sans-serif" color="white">
            Featured Playlists
          </Typography>
          <Typography fontSize={25} fontWeight={400} fontFamily="Poppins,sans-serif" color="white">
            {message ?? "Editor's picks"}
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
            {playlists.items.map((x) => (
              <SwiperSlide style={{ backgroundColor: "black" }} key={x.id}>
                <FeaturedCard playlist={x} />
              </SwiperSlide>
            ))}
          </Swiper>
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
  const [featuredObj, setFeaturedObj] = React.useState<undefined | FeaturedPlaylist>();
  const { spotifyApi } = props;

  React.useEffect(() => {
    if (spotifyToken) {
      spotifyApi
        .getFeaturedPlaylists({
          locale: "en"
        })
        .then((value) => {
          setFeaturedObj(value.body);
        })
        .catch(() => {
          logout();
          Notify("Unable to synchronize with Spotify", "error");
        });
    }
  }, [location.pathname]);

  return (
    <FeaturedPlaylistsClass
      classes={classes}
      navigate={navigate}
      spotifyApi={spotifyApi}
      featuredPlaylists={featuredObj}
    />
  );
});
