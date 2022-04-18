import * as React from "react";
import { Button, ButtonProps, Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { NavigateFunction, useNavigate } from "react-router";
import { YoutubeTracksStyles, useYoutubeTracksStyles } from "./playlist.styles";
import { extractThumbnail } from "../../helpers/thumbnails";
import { useAppContext } from "../../context/app-context";
import { AppRoutes } from "../routes/routes";
import { Artist as ArtistType } from "../../types/deezer.types";

interface OuterProps {
  artist: gapi.client.youtube.Channel;
  changeLoading: () => void;
  loading: boolean;
}

interface InnerProps extends WithStyles<typeof YoutubeTracksStyles> {
  navigate: NavigateFunction;
  setLoading: Function;
}

type Props = InnerProps & OuterProps;

class PlaylistArtistsClass extends React.PureComponent<Props> {
  componentDidMount() {
    const { setLoading, changeLoading } = this.props;

    setLoading(false);
    setTimeout(() => {
      changeLoading();
    }, 1000);
  }

  private handleOnClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate, artist } = this.props;

    if (!artist.snippet || !artist.snippet.title || !artist.snippet.thumbnails) {
      return;
    }

    const { title, thumbnails } = artist.snippet;
    const img = extractThumbnail(thumbnails);

    DZ.api(`search?q=${title}`, (response) => {
      const { data } = response;
      const filteredArtist = data.find((value) => value.artist.type === "artist" && value.artist.name === title);

      if (filteredArtist) {
        navigate(AppRoutes.Artist, {
          state: {
            artist: {
              ...filteredArtist.artist,
              picture_xl: img ?? filteredArtist.artist.picture_xl
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

    if (loading) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    if (!artist.id || !artist.snippet || !artist.snippet.thumbnails || !artist.snippet.title) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    const { title, thumbnails } = artist.snippet;

    const imageUrl = extractThumbnail(thumbnails);

    return (
      <Grid container={true} key={artist.id}>
        <Grid container={true} item={true} xs={12} style={{ justifyContent: "center" }}>
          <Grid item={true} xs={12}>
            <Button style={{ padding: 0, backgroundColor: "transparent" }} onClick={this.handleOnClick}>
              <div id="tintImg" className="tint-img">
                <img src={imageUrl} alt={title} className={classes.ytArtistImage} />
              </div>
            </Button>
          </Grid>
          <Grid item={true} xs={8}>
            <Button className={classes.ytArtistText} onClick={this.handleOnClick}>
              <Typography
                style={{ paddingTop: 8 }}
                fontSize={18}
                fontWeight={400}
                fontFamily="Poppins,sans-serif"
                textTransform="none"
                color="white">
                {title}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const PlaylistArtists = React.memo<OuterProps>((props) => {
  const classes = useYoutubeTracksStyles();
  const navigate = useNavigate();
  const { setLoading } = useAppContext();

  return <PlaylistArtistsClass setLoading={setLoading} classes={classes} navigate={navigate} {...props} />;
});
