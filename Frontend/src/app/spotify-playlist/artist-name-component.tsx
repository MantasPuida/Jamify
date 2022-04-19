import * as React from "react";
import { Button, ButtonProps, Typography } from "@mui/material";
import { useNavigate, NavigateFunction } from "react-router";
import { WithStyles } from "@mui/styles";
import { PlaylistStyles, usePlaylistStyles } from "./playlist.styles";
import { SourceType } from "./playlist-component";
import { AppRoutes } from "../routes/routes";

interface OuterProps {
  artistName: string;
  sourceType: SourceType;
}

interface InnerProps extends WithStyles<typeof PlaylistStyles> {
  navigate: NavigateFunction;
}

type Props = OuterProps & InnerProps;

class ArtistNameComponentClass extends React.PureComponent<Props> {
  private handleOnArtistClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate, artistName } = this.props;

    DZ.api(`search?q=${artistName}`, (response) => {
      const { data } = response;
      const filteredArtist = data.find((value) => value.artist.type === "artist" && value.artist.name === artistName);

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
    const { artistName, classes } = this.props;

    return (
      <Button className={classes.buttonTextOnHoverMinWidth} onClick={this.handleOnArtistClick} variant="text">
        <Typography fontFamily="Poppins, sans-serif" fontSize={16} className={classes.artistTypography}>
          {artistName}
        </Typography>
      </Button>
    );
  }
}

export const ArtistNameComponent = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();
  const classes = usePlaylistStyles();

  return <ArtistNameComponentClass {...props} classes={classes} navigate={navigate} />;
});
