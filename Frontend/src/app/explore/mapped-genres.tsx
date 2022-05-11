import * as React from "react";
import { WithStyles } from "@mui/styles";
import { Grid, Typography, Button, ButtonProps, Grow } from "@mui/material";
import SpotifyWebApi from "spotify-web-api-node";
import { NavigateFunction, useNavigate } from "react-router";
import { GenreData } from "../../types/deezer.types";
import { ExploreStyles, useExploreStyles } from "./explore.styles";
import { Notify } from "../notification/notification-component";

interface InnerProps extends WithStyles<typeof ExploreStyles> {
  navigate: NavigateFunction;
}

interface OuterProps {
  deezerGenre?: GenreData;
  spotifyGenre?: SpotifyApi.CategoryObject;
  spotifyApi: SpotifyWebApi;
}

type Props = InnerProps & OuterProps;

interface State {
  isImageLoading: boolean;
}

class MappedGenresClass extends React.PureComponent<Props, State> {
  public state: State = { isImageLoading: true };

  private handleOnClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate, spotifyGenre, deezerGenre, spotifyApi } = this.props;
    if (spotifyGenre && deezerGenre) {
      navigate(spotifyGenre.id, {
        state: {
          spotifyGenre,
          deezerGenre,
          spotifyApi
        }
      });
    } else if (spotifyGenre) {
      navigate(spotifyGenre.id, {
        state: {
          spotifyGenre,
          spotifyApi
        }
      });
    } else if (deezerGenre) {
      navigate(deezerGenre.name, {
        state: {
          deezerGenre,
          spotifyApi
        }
      });
    } else {
      Notify("Something went wrong...", "error");
    }
  };

  public render(): React.ReactNode {
    const { spotifyGenre, deezerGenre, classes } = this.props;
    const { isImageLoading } = this.state;

    let genreName = "";
    let genreIcon = "";
    if (spotifyGenre) {
      genreName = spotifyGenre.name;
      genreIcon = spotifyGenre.icons[0].url;
    } else if (deezerGenre) {
      genreName = deezerGenre.name;
      genreIcon = deezerGenre.picture_xl;
    } else {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    return (
      <Grow in={!isImageLoading} style={{ transformOrigin: "0 0 0" }} {...{ timeout: 1000 }}>
        <Grid container={true} item={true} xs={12} style={{ paddingBottom: 32 }}>
          <Grid item={true} xs={12}>
            <Button style={{ color: "black", padding: 0 }} onClick={this.handleOnClick}>
              {isImageLoading && (
                <img
                  src=""
                  alt=""
                  style={{
                    maxWidth: 220,
                    maxHeight: 220,
                    objectFit: "scale-down"
                  }}
                />
              )}
              <div className="tint-img">
                <img
                  src={genreIcon}
                  alt={genreName}
                  style={{
                    maxWidth: 220,
                    maxHeight: 220,
                    objectFit: "scale-down",
                    display: isImageLoading ? "none" : "block"
                  }}
                  onLoad={() => this.setState({ isImageLoading: false })}
                />
              </div>
            </Button>
          </Grid>
          <Grid item={true} xs={12}>
            <Button variant="text" className={classes.genreName}>
              <Typography color="white" fontSize={20} fontWeight={200} fontFamily="Poppins,sans-serif">
                {genreName}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grow>
    );
  }
}

export const MappedGenres = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();
  const classes = useExploreStyles();

  return <MappedGenresClass classes={classes} {...props} navigate={navigate} />;
});
