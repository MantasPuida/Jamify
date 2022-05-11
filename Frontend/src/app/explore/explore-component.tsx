import * as React from "react";
import { Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import memoizeOne from "memoize-one";
import TopBar from "react-topbar-progress-indicator";
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";
import { useAppContext } from "../../context/app-context";
import { useDeezerAuth } from "../../context/deezer-context";
import { useSpotifyAuth } from "../../context/spotify-context";
import { GenreData, GenreResponse } from "../../types/deezer.types";
import { LastTick } from "../../utils/last-tick";
import { ExploreStyles, useExploreStyles } from "./explore.styles";
import { MappedGenres } from "./mapped-genres";
import { Notify } from "../notification/notification-component";

interface InnerProps extends WithStyles<typeof ExploreStyles> {
  setLoading: Function;
  dzToken: string | null;
  spToken: string | null;
}

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

interface FilterReturnType {
  sameDzGenres: GenreData[];
  sameSpGenres: SpotifyApi.CategoryObject[];
}

type Props = InnerProps & OuterProps;

interface State {
  deezerGenres?: GenreResponse;
  spotifyGenres?: SpotifyApi.MultipleCategoriesResponse;
}

class ExploreClass extends React.PureComponent<Props, State> {
  public state: State = {};

  private filterSameCategories: (
    deezerGenres?: GenreResponse,
    spotifyGenres?: SpotifyApi.MultipleCategoriesResponse
  ) => FilterReturnType = memoizeOne(
    (deezerGenres?: GenreResponse, spotifyGenres?: SpotifyApi.MultipleCategoriesResponse) => {
      const { setLoading } = this.props;

      if (!deezerGenres && !spotifyGenres) {
        return { sameDzGenres: [], sameSpGenres: [] };
      }

      if (!deezerGenres && spotifyGenres) {
        return { sameDzGenres: [], sameSpGenres: spotifyGenres.categories.items };
      }

      const sameDzGenres =
        deezerGenres && spotifyGenres
          ? deezerGenres.data.filter((deezerGenre) => {
              const spotifyGenre = spotifyGenres.categories.items.find(
                (genre) => deezerGenre.name.includes(genre.name) || genre.name.includes(deezerGenre.name)
              );

              return spotifyGenre;
            })
          : [];

      const sameSpGenres =
        deezerGenres && spotifyGenres
          ? spotifyGenres.categories.items.filter((spotifyGenre) => {
              const deezerGenre = sameDzGenres.find(
                (genre) => genre.name.includes(spotifyGenre.name) || spotifyGenre.name.includes(genre.name)
              );

              return deezerGenre;
            })
          : [];

      setLoading(false);

      return { sameDzGenres, sameSpGenres };
    }
  );

  constructor(props: Props) {
    super(props);

    const { dzToken, spToken } = props;

    if (dzToken) {
      setTimeout(() => {
        DZ.api("genre", (response) => {
          this.setState({ deezerGenres: response as GenreResponse });
        });
      }, 1000);
    }

    if (spToken) {
      setTimeout(async () => {
        const apiUrl = "https://api.spotify.com/v1/browse/categories?limit=50";
        try {
          const response = await axios.get(apiUrl, {
            headers: {
              Authorization: `Bearer ${spToken}`
            }
          });
          this.setState({ spotifyGenres: response.data as SpotifyApi.MultipleCategoriesResponse });
        } catch (error) {
          Notify("Could not resolve Genres", "error");
        }
      }, 1000);
    }
  }

  componentDidMount() {
    const { setLoading } = this.props;

    LastTick(() => {
      setLoading(false);
    });
  }

  public render(): React.ReactNode {
    const { classes, dzToken, spToken, spotifyApi } = this.props;
    const { deezerGenres, spotifyGenres } = this.state;

    if ((!deezerGenres && dzToken) || (!spotifyGenres && spToken)) {
      return <TopBar />;
    }

    const { sameDzGenres, sameSpGenres } = this.filterSameCategories(deezerGenres, spotifyGenres);

    return (
      <Grid container={true} item={true} xs={12} className={classes.exploreGrid}>
        <Grid container={true} item={true} xs={12}>
          <Grid item={true} xs={12}>
            <Typography fontSize={45} fontWeight={900} fontFamily="Poppins,sans-serif" color="white">
              Genres
            </Typography>
          </Grid>
        </Grid>
        {spToken && dzToken && (
          <Grid container={true} item={true} xs={12} style={{ display: "flex", maxWidth: "85%" }}>
            {sameDzGenres.map((genre, index) => {
              if (!genre.id || !sameSpGenres[index]) {
                return null;
              }

              return (
                <Grid item={true} xs={2} key={genre.id}>
                  <MappedGenres deezerGenre={genre} spotifyGenre={sameSpGenres[index]} spotifyApi={spotifyApi} />
                </Grid>
              );
            })}
          </Grid>
        )}
        {spToken && !dzToken && spotifyGenres && spotifyGenres.categories.items.length > 0 && (
          <Grid container={true} item={true} xs={12} style={{ display: "flex", maxWidth: "85%" }}>
            {spotifyGenres?.categories.items.map((genre) => {
              if (!genre.id) {
                return null;
              }

              return (
                <Grid item={true} xs={2} key={genre.id}>
                  <MappedGenres spotifyGenre={genre} spotifyApi={spotifyApi} />
                </Grid>
              );
            })}
          </Grid>
        )}
        {!spToken && dzToken && deezerGenres && deezerGenres.data.length > 0 && (
          <Grid container={true} item={true} xs={12} style={{ display: "flex", maxWidth: "85%" }}>
            {deezerGenres.data.map((genre) => {
              if (!genre.id) {
                return null;
              }

              return (
                <Grid item={true} xs={2} key={genre.id}>
                  <MappedGenres deezerGenre={genre} spotifyApi={spotifyApi} />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Grid>
    );
  }
}

export const Explore = React.memo<OuterProps>((props) => {
  const classes = useExploreStyles();
  const { setLoading } = useAppContext();
  const { deezerToken } = useDeezerAuth();
  const { spotifyToken } = useSpotifyAuth();

  return (
    <ExploreClass dzToken={deezerToken} spToken={spotifyToken} setLoading={setLoading} classes={classes} {...props} />
  );
});
