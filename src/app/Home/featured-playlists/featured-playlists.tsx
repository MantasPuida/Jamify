/* eslint-disable react/no-array-index-key */
import * as React from "react";
import { NavigateFunction, useLocation, useNavigate } from "react-router";
import Carousel from "react-multi-carousel";
import SpotifyWebApi from "spotify-web-api-node";
import { WithStyles } from "@mui/styles";
import { Grid, Typography } from "@mui/material";
import { FeaturedPlaylistsStyles, useFeaturedPlaylistsStyles } from "./featured.styles";
import { useSpotifyAuth } from "../../../context/spotify-context";
import { Notify } from "../../notification/notification-component";
import { FeaturedCard } from "./featured-card";

import "react-multi-carousel/lib/styles.css";

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

    const responsive = {
      superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 5
      },
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
      }
    };

    // eslint-disable-next-line consistent-return
    return (
      <Grid container={true} item={true} xs={12} className={classes.featuredPlaylistsGrid}>
        <Grid container={true}>
          <Grid item={true} xs={12}>
            <Typography fontSize={45} fontWeight={900} fontFamily="Poppins,sans-serif" color="white">
              Featured Playlists
            </Typography>
            <Typography fontSize={25} fontWeight={400} fontFamily="Poppins,sans-serif" color="white">
              {message ?? "Editor's picks"}
            </Typography>
          </Grid>
          <Grid item={true} xs={12}>
            <Carousel
              responsive={responsive}
              className={classes.carousel}
              autoPlay={false}
              centerMode={true}
              draggable={false}
              keyBoardControl={true}
            >
              {playlists.items.map((x) => (
                <FeaturedCard playlist={x} key={x.id} />
              ))}
            </Carousel>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const FeaturedPlaylists = React.memo<OuterProps>((props) => {
  const classes = useFeaturedPlaylistsStyles();
  const { spotifyToken } = useSpotifyAuth();
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
          Notify("Unable to fetch Spotify data", "error");
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
