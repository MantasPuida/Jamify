import * as React from "react";
import { Grid, Typography, Button, ButtonProps } from "@mui/material";
import { NavigateFunction, useNavigate } from "react-router";
import { WithStyles } from "@mui/styles";
import { SearchStyles } from "../search.styles";
import { AppRoutes } from "../../routes/routes";
import { FeaturedPlaylistState } from "../../Home/featured-playlists/featured-card";

import "../fontFamily.css";

interface OuterProps extends WithStyles<typeof SearchStyles> {
  playlist: SpotifyApi.PlaylistObjectSimplified;
}

interface InnerProps {
  navigate: NavigateFunction;
}

type Props = OuterProps & InnerProps;

class SearchPlaylistClass extends React.PureComponent<Props> {
  private handleOnClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate, playlist: spotifyPlaylist } = this.props;
    navigate(AppRoutes.Playlist, { state: { spotifyPlaylist, myOwn: false } as FeaturedPlaylistState });
  };

  public render(): React.ReactNode {
    const { playlist, classes } = this.props;

    return (
      <Grid container={true}>
        <Grid container={true} item={true} xs={12} style={{ paddingRight: 32 }}>
          <Grid item={true} xs={12}>
            <Button style={{ padding: 0, color: "transparent" }} onClick={this.handleOnClick}>
              <img
                src={playlist.images[0].url}
                alt={playlist.name}
                style={{ maxWidth: 160, maxHeight: 160, objectFit: "scale-down" }}
              />
            </Button>
          </Grid>
          <Grid item={true} xs={12}>
            <Button
              variant="text"
              style={{ padding: 0, color: "transparent", textTransform: "none" }}
              onClick={this.handleOnClick}>
              <Typography className={classes.typography} color="white">
                {playlist.name}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const SearchPlaylist = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();

  return <SearchPlaylistClass navigate={navigate} {...props} />;
});
