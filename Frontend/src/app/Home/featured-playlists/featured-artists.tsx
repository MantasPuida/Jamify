import * as React from "react";
import { Button, ButtonProps, Grid, Typography, Grow } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { NavigateFunction, useNavigate } from "react-router";
import { FeaturedPlaylistsStyles, useFeaturedPlaylistsStyles } from "./featured.styles";
import { useAppContext } from "../../../context/app-context";
import { Artist as ArtistType } from "../../../types/deezer.types";
import { AppRoutes } from "../../routes/routes";

interface OuterProps {
  artist: SpotifyApi.ArtistObjectFull;
  changeState: () => void;
  loading: boolean;
}

interface InnerProps extends WithStyles<typeof FeaturedPlaylistsStyles> {
  navigate: NavigateFunction;
  setLoading: Function;
}

type Props = InnerProps & OuterProps;

interface State {
  isImageLoading: boolean;
}

class FeaturedArtistsClass extends React.PureComponent<Props, State> {
  public state: State = { isImageLoading: true };

  componentDidMount() {
    const { setLoading, changeState } = this.props;

    setLoading(false);
    changeState();
  }

  private handleOnClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { artist, navigate } = this.props;

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
    const { artist, classes, loading } = this.props;
    const { isImageLoading } = this.state;

    const { images, name, id } = artist;

    return (
      <Grow in={!loading && !isImageLoading} style={{ transformOrigin: "0 0 0" }} {...{ timeout: 1000 }}>
        <Grid container={true} key={id}>
          <Grid container={true} item={true} xs={12} style={{ justifyContent: "center" }}>
            <Grid item={true} xs={12}>
              <Button
                style={{ padding: 0, backgroundColor: "transparent", width: 220, height: 220 }}
                onClick={this.handleOnClick}>
                {isImageLoading || (loading && <img src="" alt="" className={classes.artistImage} />)}
                <div id="tintImg" className="tint-img">
                  <img
                    src={images[0].url}
                    alt={name}
                    className={classes.artistImage}
                    style={{ display: isImageLoading ? "none" : "block" }}
                    onLoad={() => this.setState({ isImageLoading: false })}
                  />
                </div>
              </Button>
            </Grid>
            <Grid item={true} xs={8}>
              <Button className={classes.artistText} onClick={this.handleOnClick}>
                <Typography
                  style={{ paddingTop: 8 }}
                  fontSize={18}
                  fontWeight={400}
                  fontFamily="Poppins,sans-serif"
                  textTransform="none"
                  color="white">
                  {name}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grow>
    );
  }
}

export const FeaturedArtists = React.memo<OuterProps>((props) => {
  const classes = useFeaturedPlaylistsStyles();
  const navigate = useNavigate();
  const { setLoading } = useAppContext();

  return <FeaturedArtistsClass setLoading={setLoading} classes={classes} navigate={navigate} {...props} />;
});
