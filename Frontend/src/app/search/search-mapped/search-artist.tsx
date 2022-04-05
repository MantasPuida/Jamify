import * as React from "react";
import { Grid, Typography } from "@mui/material";
import { NavigateFunction, useNavigate } from "react-router";
import { WithStyles } from "@mui/styles";
import { SearchStyles } from "../search.styles";

import "../fontFamily.css";

interface OuterProps extends WithStyles<typeof SearchStyles> {
  artist: SpotifyApi.ArtistObjectFull;
}

interface InnerProps {
  navigate: NavigateFunction;
}

type Props = OuterProps & InnerProps;

class SearchArtistsClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { artist, classes } = this.props;

    return (
      <Grid container={true}>
        <Grid item={true} xs={12} style={{ paddingRight: 32 }}>
          <img
            src={artist.images[0].url}
            alt={artist.name}
            style={{ width: 160, height: 160, objectFit: "scale-down", borderRadius: "50%" }}
          />
          <Typography className={classes.typographyWithPadding} color="white">
            {artist.name}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export const SearchArtists = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();

  return <SearchArtistsClass navigate={navigate} {...props} />;
});
