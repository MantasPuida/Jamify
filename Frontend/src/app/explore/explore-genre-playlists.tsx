import * as React from "react";
import axios from "axios";
import { Grid, Typography, Button, ButtonProps } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { useLocation } from "react-router";
import SpotifyWebApi from "spotify-web-api-node";
import { useAppContext } from "../../context/app-context";
import { useDeezerAuth } from "../../context/deezer-context";
import { useSpotifyAuth } from "../../context/spotify-context";
import { GenreData, GenreDataArtists, SearchPlaylistResponse } from "../../types/deezer.types";
import { ExploreStyles, useExploreStyles } from "./explore.styles";
import { MappedGenreArtists } from "./mapped-genre-artists";
import { MappedGenrePlaylists } from "./mapped-genre-playlists";

interface LocationStateType {
  deezerGenre?: GenreData;
  spotifyGenre?: SpotifyApi.CategoryObject;
  spotifyApi: SpotifyWebApi;
}

interface InnerProps extends LocationStateType, WithStyles<typeof ExploreStyles> {
  setLoading: Function;
  genrePlaylists: SpotifyApi.CategoryPlaylistsResponse | undefined;
  genreArtists: GenreDataArtists | undefined;
  deezerGenrePlaylists: SearchPlaylistResponse | undefined;
}

interface State {
  isClickedPlaylists: Boolean;
  isClickedArtists: Boolean;
}

class ExplorePlaylistsClass extends React.PureComponent<InnerProps, State> {
  public state: State = { isClickedPlaylists: false, isClickedArtists: false };

  componentDidMount() {
    const { setLoading } = this.props;

    setLoading(false);
  }

  private handleOnShowMoreTracks: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState((state) => ({ isClickedPlaylists: !state.isClickedPlaylists }));
  };

  private handleOnShowMoreArtists: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState((state) => ({ isClickedArtists: !state.isClickedArtists }));
  };

  public render(): React.ReactNode {
    const { classes, spotifyGenre, genrePlaylists, deezerGenrePlaylists, deezerGenre, spotifyApi, genreArtists } =
      this.props;
    const { isClickedPlaylists, isClickedArtists } = this.state;

    let genreName = "";

    if (spotifyGenre) {
      genreName = spotifyGenre.name;
    } else if (deezerGenre) {
      genreName = deezerGenre.name;
    } else {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    return (
      <Grid container={true} item={true} xs={12} className={classes.exploreGrid}>
        <Grid container={true} item={true} xs={12}>
          <Grid item={true} xs={12}>
            <Typography fontSize={45} fontWeight={900} fontFamily="Poppins,sans-serif" color="white">
              {genreName}
            </Typography>
          </Grid>
          {(genrePlaylists || deezerGenrePlaylists) && (
            <Grid item={true}>
              <Typography
                fontSize={25}
                fontWeight={400}
                fontFamily="Poppins,sans-serif"
                color="white"
                style={{ float: "left", paddingBottom: 16, paddingTop: 16 }}>
                Playlists
              </Typography>
            </Grid>
          )}
        </Grid>
        {genrePlaylists && (
          <Grid container={true} item={true} xs={12} style={{ display: "flex", maxWidth: "85%" }}>
            {genrePlaylists?.playlists.items.map((playlist, index) => {
              if (!playlist.id || (index > 5 && !isClickedPlaylists)) {
                return null;
              }

              return (
                <Grid item={true} xs={2} key={playlist.id}>
                  <MappedGenrePlaylists src="spotify" playlist={playlist} spotifyApi={spotifyApi} />
                </Grid>
              );
            })}
          </Grid>
        )}
        {deezerGenrePlaylists && !genrePlaylists && (
          <Grid container={true} item={true} xs={12} style={{ display: "flex", maxWidth: "85%" }}>
            {deezerGenrePlaylists.data.map((playlist, index) => {
              if (!playlist.id || (index > 5 && !isClickedPlaylists)) {
                return null;
              }

              return (
                <Grid item={true} xs={2} key={playlist.id}>
                  <MappedGenrePlaylists src="deezer" playlist={playlist} spotifyApi={spotifyApi} />
                </Grid>
              );
            })}
          </Grid>
        )}
        {genrePlaylists && (
          <Grid item={true} xs={12}>
            {genrePlaylists.playlists.items.length > 6 && (
              <Button
                variant="outlined"
                style={{ backgroundColor: "white", color: "black", borderColor: "white", borderRadius: 15 }}
                onClick={this.handleOnShowMoreTracks}>
                <Typography fontFamily="Poppins, sans-serif">
                  Show {isClickedPlaylists ? "Less" : "More"} Playlists
                </Typography>
              </Button>
            )}
          </Grid>
        )}
        {!genrePlaylists && deezerGenrePlaylists && (
          <Grid item={true} xs={12}>
            {deezerGenrePlaylists.data.length > 6 && (
              <Button
                variant="outlined"
                style={{ backgroundColor: "white", color: "black", borderColor: "white", borderRadius: 15 }}
                onClick={this.handleOnShowMoreTracks}>
                <Typography fontFamily="Poppins, sans-serif">
                  Show {isClickedPlaylists ? "Less" : "More"} Playlists
                </Typography>
              </Button>
            )}
          </Grid>
        )}
        {genreArtists && genreArtists.data.length > 0 && (
          <Grid container={true} item={true} xs={12}>
            <Grid item={true} xs={12} style={{ paddingTop: 16 }}>
              <Typography
                fontSize={25}
                fontWeight={400}
                fontFamily="Poppins,sans-serif"
                color="white"
                style={{ float: "left", paddingBottom: 16, paddingTop: 16 }}>
                Artists
              </Typography>
            </Grid>
            <Grid container={true} item={true} xs={12} style={{ display: "flex", maxWidth: "85%" }}>
              {genreArtists?.data.map((artist, index) => {
                if (!artist.id || (index > 5 && !isClickedArtists)) {
                  return null;
                }

                return (
                  <Grid item={true} xs={2} key={artist.id}>
                    <MappedGenreArtists artist={artist} spotifyApi={spotifyApi} />
                  </Grid>
                );
              })}
            </Grid>
            {genreArtists && (
              <Grid item={true} xs={12}>
                {genreArtists.data.length > 6 && (
                  <Button
                    variant="outlined"
                    style={{ backgroundColor: "white", color: "black", borderColor: "white", borderRadius: 15 }}
                    onClick={this.handleOnShowMoreArtists}>
                    <Typography fontFamily="Poppins, sans-serif">
                      Show {isClickedArtists ? "Less" : "More"} Artists
                    </Typography>
                  </Button>
                )}
              </Grid>
            )}
          </Grid>
        )}
      </Grid>
    );
  }
}

export const ExplorePlaylists = React.memo(() => {
  const location = useLocation();
  const [genrePlaylists, setGenrePlaylists] = React.useState<SpotifyApi.CategoryPlaylistsResponse>();
  const [deezerGenrePlaylists, setDeezerGenrePlaylists] = React.useState<SearchPlaylistResponse>();
  const [genreArtists, setGenreArtists] = React.useState<GenreDataArtists>();
  const { deezerGenre, spotifyGenre, spotifyApi } = location.state as LocationStateType;
  const { setLoading } = useAppContext();
  const { spotifyToken } = useSpotifyAuth();
  const { deezerToken } = useDeezerAuth();
  const classes = useExploreStyles();

  React.useEffect(() => {
    if (spotifyToken && spotifyGenre) {
      setTimeout(async () => {
        const apiUrl = `https://api.spotify.com/v1/browse/categories/${spotifyGenre.id}/playlists?limit=50`;
        try {
          const response = await axios.get(apiUrl, {
            headers: {
              Authorization: `Bearer ${spotifyToken}`
            }
          });

          setGenrePlaylists(response.data as SpotifyApi.CategoryPlaylistsResponse);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }, 50);
    }

    if (deezerToken && deezerGenre) {
      DZ.api(`genre/${deezerGenre.id}/artists`, (response) => {
        response.data = response.data.filter((artist) => artist.name !== "Justinas Jarutis");

        if (!spotifyToken || !spotifyGenre) {
          DZ.api(`search/playlist?q=${deezerGenre.name}`, (data) => {
            setDeezerGenrePlaylists(data as SearchPlaylistResponse);
          });
        }

        setGenreArtists(response as GenreDataArtists);
      });
    }
  }, [location]);

  return (
    <ExplorePlaylistsClass
      classes={classes}
      deezerGenrePlaylists={deezerGenrePlaylists}
      spotifyApi={spotifyApi}
      setLoading={setLoading}
      genrePlaylists={genrePlaylists}
      genreArtists={genreArtists}
      deezerGenre={deezerGenre}
      spotifyGenre={spotifyGenre}
    />
  );
});
