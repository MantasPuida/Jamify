import * as React from "react";
import { Button, ButtonProps, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { NavigateFunction, useNavigate } from "react-router";
import { useFeaturedPlaylistsStyles, FeaturedPlaylistsStyles } from "./featured.styles";
import { AppRoutes } from "../../routes/routes";
import { useAppContext } from "../../../context/app-context";

interface OuterProps {
  artist: SpotifyApi.ArtistObjectSimplified;
  artistIndex: number;
  arrayLength: number;
}

interface InnerProps extends WithStyles<typeof FeaturedPlaylistsStyles> {
  navigate: NavigateFunction;
  setLoading: Function;
}

type Props = InnerProps & OuterProps;

class ArtistsMappedClass extends React.PureComponent<Props> {
  private handleOnArtistClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate, artist, setLoading } = this.props;
    setLoading(true);

    DZ.api(`search?q=${artist.name}`, (response) => {
      const { data } = response;
      const filteredArtist = data.find((value) => value.artist.type === "artist" && value.artist.name === artist.name);

      if (filteredArtist) {
        navigate(AppRoutes.Artist, {
          state: {
            artist: {
              ...filteredArtist.artist,
              picture_xl: filteredArtist.artist.picture_xl
            }
          }
        });
      } else {
        navigate(AppRoutes.Artist, { state: { artist: data[0].artist } });
      }
    });
  };

  public render(): React.ReactNode {
    const { artist, classes, arrayLength, artistIndex } = this.props;

    const comma = artistIndex !== arrayLength - 1 ? ", " : "";

    return (
      <Button
        onClick={this.handleOnArtistClick}
        style={{
          textAlign: "left",
          textTransform: "none",
          justifyContent: "left",
          minWidth: "fit-content",
          color: "transparent",
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0
        }}
        className={classes.buttonOnHover}
        variant="text">
        <Typography className={classes.helperTypography} fontFamily="Poppins,sans-serif" fontSize={12}>
          {`${artist.name}${comma}`}
        </Typography>
      </Button>
    );
  }
}

export const ArtistsMapped = React.memo<OuterProps>((props) => {
  const classes = useFeaturedPlaylistsStyles();
  const navigate = useNavigate();
  const { setLoading } = useAppContext();

  return <ArtistsMappedClass setLoading={setLoading} navigate={navigate} {...props} classes={classes} />;
});
