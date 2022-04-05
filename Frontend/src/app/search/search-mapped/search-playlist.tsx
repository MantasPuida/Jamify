import * as React from "react";
import { Grid, Typography } from "@mui/material";
import { NavigateFunction, useNavigate } from "react-router";
import { WithStyles } from "@mui/styles";
import { SearchStyles } from "../search.styles";

import "../fontFamily.css";

interface OuterProps extends WithStyles<typeof SearchStyles> {
  playlist: SpotifyApi.PlaylistObjectSimplified;
}

interface InnerProps {
  navigate: NavigateFunction;
}

type Props = OuterProps & InnerProps;

class SearchPlaylistClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { playlist, classes } = this.props;

    return (
      <Grid container={true}>
        <Grid item={true} xs={12} style={{ paddingRight: 32 }}>
          <img
            src={playlist.images[0].url}
            alt={playlist.name}
            style={{ maxWidth: 160, maxHeight: 160, objectFit: "scale-down" }}
          />
          <Typography className={classes.typography} color="white">
            {playlist.name}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export const SearchPlaylist = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();

  return <SearchPlaylistClass navigate={navigate} {...props} />;
});
