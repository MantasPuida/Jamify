import * as React from "react";
import { WithStyles } from "@mui/styles";
import { Grid, IconButtonProps, SelectProps, TextField, TextFieldProps } from "@mui/material";
import SpotifyWebApi from "spotify-web-api-node";
import { EndAdornment } from "./adornment";
import { SearchStyles, useSearchStyles } from "./search.styles";

import "./fontFamily.css";
import { SearchComponentContent } from "./search-component-content";

type InnerProps = WithStyles<typeof SearchStyles>;

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

type Props = InnerProps & OuterProps;

type SourceType = "Tracks" | "Artists" | "Playlists" | "All";

interface State {
  searchTerm?: string;
  source?: SourceType;
  isLoading: boolean;
  tracks?: SpotifyApi.SearchResponse;
  artists?: SpotifyApi.SearchResponse;
  playlists?: SpotifyApi.SearchResponse;
}

class SearchClass extends React.PureComponent<Props, State> {
  public state: State = { searchTerm: "", source: "All", isLoading: false };

  private handleOnChange: SelectProps["onChange"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { value } = event.target as HTMLSelectElement;
    this.setState({ source: value as SourceType });
  };

  private handleOnClick: IconButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({ isLoading: true, artists: undefined, playlists: undefined, tracks: undefined });

    const { spotifyApi } = this.props;
    const { source, searchTerm } = this.state;

    if (searchTerm) {
      switch (source) {
        case "Tracks":
          spotifyApi
            .searchTracks(searchTerm)
            .then((data) => {
              this.setState({ isLoading: false, tracks: data.body });
            })
            .catch(() => {
              this.setState({ isLoading: false });
            });
          break;
        case "Artists":
          spotifyApi
            .searchArtists(searchTerm)
            .then((data) => {
              this.setState({ isLoading: false, artists: data.body });
            })
            .catch(() => {
              this.setState({ isLoading: false });
            });
          break;
        case "Playlists":
          spotifyApi
            .searchPlaylists(searchTerm)
            .then((data) => {
              this.setState({ isLoading: false, playlists: data.body });
            })
            .catch(() => {
              this.setState({ isLoading: false });
            });
          break;
        default: {
          spotifyApi
            .searchPlaylists(searchTerm)
            .then((playlists) =>
              spotifyApi
                .searchArtists(searchTerm)
                .then((artists) =>
                  spotifyApi
                    .searchTracks(searchTerm)
                    .then((tracks) => {
                      this.setState({
                        isLoading: false,
                        playlists: playlists.body,
                        artists: artists.body,
                        tracks: tracks.body
                      });
                    })
                    .catch(() => {
                      this.setState({ isLoading: false });
                    })
                )
                .catch(() => {
                  this.setState({ isLoading: false });
                })
            )
            .catch(() => {
              this.setState({ isLoading: false });
            });
          break;
        }
      }
    }
  };

  private handleOnKeyUp: TextFieldProps["onKeyUp"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.type === "keyup" && event.key === "Enter") {
      this.setState({ isLoading: true, artists: undefined, playlists: undefined, tracks: undefined });

      const { spotifyApi } = this.props;
      const { source, searchTerm } = this.state;

      if (searchTerm) {
        switch (source) {
          case "Tracks":
            spotifyApi
              .searchTracks(searchTerm)
              .then((data) => {
                this.setState({ isLoading: false, tracks: data.body });
              })
              .catch(() => {
                this.setState({ isLoading: false });
              });
            break;
          case "Artists":
            spotifyApi
              .searchArtists(searchTerm)
              .then((data) => {
                this.setState({ isLoading: false, artists: data.body });
              })
              .catch(() => {
                this.setState({ isLoading: false });
              });
            break;
          case "Playlists":
            spotifyApi
              .searchPlaylists(searchTerm)
              .then((data) => {
                this.setState({ isLoading: false, playlists: data.body });
              })
              .catch(() => {
                this.setState({ isLoading: false });
              });
            break;
          default: {
            spotifyApi
              .searchPlaylists(searchTerm)
              .then((playlists) =>
                spotifyApi
                  .searchArtists(searchTerm)
                  .then((artists) =>
                    spotifyApi
                      .searchTracks(searchTerm)
                      .then((tracks) => {
                        this.setState({
                          isLoading: false,
                          playlists: playlists.body,
                          artists: artists.body,
                          tracks: tracks.body
                        });
                      })
                      .catch(() => {
                        this.setState({ isLoading: false });
                      })
                  )
                  .catch(() => {
                    this.setState({ isLoading: false });
                  })
              )
              .catch(() => {
                this.setState({ isLoading: false });
              });
            break;
          }
        }
      }
    }
  };

  private handleChange: TextFieldProps["onChange"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({ searchTerm: event.target.value });
  };

  public render(): React.ReactNode {
    const { classes } = this.props;
    const { isLoading, source, artists, playlists, tracks } = this.state;

    return (
      <Grid container={true} className={classes.homeGrid}>
        <Grid item={true} xs={12}>
          <TextField
            sx={{
              border: "1px solid white",
              ".css-ghsjzk-MuiInputBase-root-MuiInput-root:after": {
                borderBottom: "2px solid white"
              }
            }}
            onChange={this.handleChange}
            onKeyUp={this.handleOnKeyUp}
            className={classes.textField}
            variant="standard"
            fullWidth={true}
            InputProps={{
              endAdornment: (
                <EndAdornment
                  handleOnChange={this.handleOnChange}
                  handleOnClick={this.handleOnClick}
                  source={source!}
                />
              ),
              style: { color: "white", padding: 8, fontFamily: "Poppins,sans-serif", fontSize: 16 }
            }}
            size="medium"
          />
        </Grid>
        <Grid item={true} xs={12}>
          <SearchComponentContent
            isLoading={isLoading}
            artists={artists}
            playlists={playlists}
            tracks={tracks}
            classes={classes}
          />
        </Grid>
      </Grid>
    );
  }
}

export const Search = React.memo<OuterProps>((props) => {
  const classes = useSearchStyles();

  return <SearchClass classes={classes} {...props} />;
});
