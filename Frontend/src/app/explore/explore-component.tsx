import { Grid } from "@mui/material";
import { WithStyles } from "@mui/styles";
import * as React from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { useAppContext } from "../../context/app-context";
import { useDeezerAuth } from "../../context/deezer-context";
import { useSpotifyAuth } from "../../context/spotify-context";
import { GenreResponse } from "../../types/deezer.types";
import { LastTick } from "../../utils/last-tick";
import { HomeLandingPageStyles, useHomeLandingPageStyles } from "../Home/landing-page.styles";
import { BackdropLoader } from "../loader/loader-backdrop";

interface InnerProps extends WithStyles<typeof HomeLandingPageStyles> {
  setLoading: Function;
  dzToken: string | null;
  spToken: string | null;
}

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

type Props = InnerProps & OuterProps;

interface State {
  deezerGenres?: GenreResponse;
  spotifyGenres?: SpotifyApi.MultipleCategoriesResponse;
}

class ExploreClass extends React.PureComponent<Props, State> {
  public state: State = {};

  constructor(props: Props) {
    super(props);

    const { spotifyApi, dzToken, spToken } = props;

    if (dzToken) {
      DZ.api("genre", (response) => {
        this.setState({ deezerGenres: response as GenreResponse });
      });
    }

    if (spToken) {
      spotifyApi.getCategories().then((response) => {
        this.setState({ spotifyGenres: response.body as SpotifyApi.MultipleCategoriesResponse });
      });
    }
  }

  componentDidMount() {
    const { setLoading } = this.props;

    LastTick(() => {
      setLoading(false);
    });
  }

  public render(): React.ReactNode {
    const { classes, dzToken, spToken } = this.props;
    const { deezerGenres, spotifyGenres } = this.state;

    if ((!deezerGenres && dzToken) || (!spotifyGenres && spToken)) {
      return <BackdropLoader />;
    }

    const sameDzGenres =
      deezerGenres && spotifyGenres
        ? deezerGenres.data.filter((deezerGenre) => {
            const spotifyGenre = spotifyGenres.categories.items.find(
              (genre) => genre.name.includes(deezerGenre.name) || deezerGenre.name.includes(genre.name)
            );

            return spotifyGenre;
          })
        : [];

    return (
      <Grid container={true} item={true} xs={12} className={classes.homeGrid}>
        {sameDzGenres.map((genre) => (
          <Grid item={true} xs={12} key={genre.id}>
            <img src={genre.picture_xl} alt={genre.name} />
          </Grid>
        ))}
      </Grid>
    );
  }
}

export const Explore = React.memo<OuterProps>((props) => {
  const classes = useHomeLandingPageStyles();
  const { setLoading } = useAppContext();
  const { deezerToken } = useDeezerAuth();
  const { spotifyToken } = useSpotifyAuth();

  return (
    <ExploreClass dzToken={deezerToken} spToken={spotifyToken} setLoading={setLoading} classes={classes} {...props} />
  );
});
