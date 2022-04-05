import * as React from "react";
import { Grid, Typography } from "@mui/material";
import { NavigateFunction, useNavigate } from "react-router";
import { WithStyles } from "@mui/styles";
import { SearchStyles } from "../search.styles";

import "../fontFamily.css";

interface OuterProps extends WithStyles<typeof SearchStyles> {
  track: SpotifyApi.TrackObjectFull;
}

interface InnerProps {
  navigate: NavigateFunction;
}

type Props = OuterProps & InnerProps;

class SearchTrackClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { track, classes } = this.props;

    return (
      <Grid container={true}>
        <Grid item={true} xs={12} style={{ paddingRight: 32 }}>
          <img
            src={track.album.images[0].url}
            alt={track.album.name}
            style={{ maxWidth: 160, maxHeight: 160, objectFit: "scale-down" }}
          />
          <Typography className={classes.typography} color="white">
            {track.name}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export const SearchTrack = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();

  return <SearchTrackClass navigate={navigate} {...props} />;
});
