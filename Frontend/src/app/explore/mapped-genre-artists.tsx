import * as React from "react";
import { WithStyles } from "@mui/styles";
import { Grid, Typography, Button, ButtonProps } from "@mui/material";
import SpotifyWebApi from "spotify-web-api-node";
import { NavigateFunction, useNavigate } from "react-router";
import { ExploreStyles, useExploreStyles } from "./explore.styles";
import { useAppContext } from "../../context/app-context";
import { GenreDataArtist } from "../../types/deezer.types";
import { AppRoutes } from "../routes/routes";

interface InnerProps extends WithStyles<typeof ExploreStyles> {
  navigate: NavigateFunction;
  setLoading: Function;
}

interface OuterProps {
  artist: GenreDataArtist;
  spotifyApi: SpotifyWebApi;
}

type Props = InnerProps & OuterProps;

class MappedGenreArtistsClass extends React.PureComponent<Props> {
  componentDidMount() {
    const { setLoading } = this.props;

    setLoading(false);
  }

  private handleOnClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate, artist } = this.props;
    navigate(AppRoutes.Artist, { state: { artist } });
  };

  public render(): React.ReactNode {
    const { artist, classes } = this.props;

    return (
      <Grid container={true} item={true} xs={12} style={{ paddingBottom: 32 }}>
        <Grid item={true} xs={12}>
          <Button style={{ color: "black", padding: 0 }} onClick={this.handleOnClick}>
            <div className="tint-img">
              <img
                src={artist.picture_xl}
                alt={artist.name}
                style={{ maxWidth: 220, maxHeight: 220, objectFit: "scale-down", borderRadius: "50%" }}
              />
            </div>
          </Button>
        </Grid>
        <Grid item={true} xs={12} style={{ maxWidth: "67%", textAlign: "center" }}>
          <Button variant="text" className={classes.genreName} onClick={this.handleOnClick}>
            <Typography color="white" fontSize={20} fontWeight={200} fontFamily="Poppins,sans-serif">
              {artist.name}
            </Typography>
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export const MappedGenreArtists = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();
  const classes = useExploreStyles();
  const { setLoading } = useAppContext();

  return <MappedGenreArtistsClass setLoading={setLoading} classes={classes} {...props} navigate={navigate} />;
});
