import * as React from "react";
import { Grid, Typography, Button, ButtonProps, Grow } from "@mui/material";
import { NavigateFunction, useNavigate } from "react-router";
import { WithStyles } from "@mui/styles";
import { SearchStyles } from "../search.styles";
import { AppRoutes } from "../../routes/routes";
import { Artist as ArtistType } from "../../../types/deezer.types";

import "../fontFamily.css";

interface OuterProps extends WithStyles<typeof SearchStyles> {
  artist: SpotifyApi.ArtistObjectFull;
}

interface InnerProps {
  navigate: NavigateFunction;
}

interface State {
  isImageLoading: boolean;
}

type Props = OuterProps & InnerProps;

class SearchArtistsClass extends React.PureComponent<Props> {
  public state: State = { isImageLoading: true };

  private handleOnClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate, artist } = this.props;

    DZ.api(`search?q=${artist.name}`, (response) => {
      const { data } = response;
      const filteredArtist = data.find((value) => value.artist.type === "artist" && value.artist.name === artist.name);

      if (filteredArtist) {
        navigate(AppRoutes.Artist, {
          state: {
            artist: {
              ...filteredArtist.artist,
              picture_xl: artist.images[0].url ?? filteredArtist.artist.picture_xl
            } as ArtistType
          }
        });
      } else {
        navigate(AppRoutes.Artist, { state: { artist: data[0].artist as ArtistType } });
      }
    });
  };

  public render(): React.ReactNode {
    const { artist, classes } = this.props;
    const { isImageLoading } = this.state;

    return (
      <Grow in={!isImageLoading} style={{ transformOrigin: "0 0 0" }} {...{ timeout: 800 }}>
        <Grid container={true} style={{ maxWidth: 280 }}>
          <Grid item={true} xs={12} style={{ paddingRight: 32 }}>
            <Button style={{ padding: 0, color: "transparent" }} onClick={this.handleOnClick}>
              <div className="tint-img">
                <img
                  src={artist.images[0].url}
                  onLoad={() => this.setState({ isImageLoading: false })}
                  alt={artist.name}
                  style={{ width: 160, height: 160, objectFit: "scale-down", borderRadius: "50%" }}
                />
              </div>
            </Button>
            <Button
              variant="text"
              style={{ padding: 0, color: "transparent", textTransform: "none", width: "64%", marginLeft: 14 }}
              onClick={this.handleOnClick}>
              <Typography className={classes.typographyWithPadding} color="white">
                {artist.name}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grow>
    );
  }
}

export const SearchArtists = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();

  return <SearchArtistsClass navigate={navigate} {...props} />;
});
