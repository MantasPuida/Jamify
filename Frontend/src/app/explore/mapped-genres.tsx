import * as React from "react";
import { WithStyles } from "@mui/styles";
import { Grid, Typography, Button } from "@mui/material";
import { NavigateFunction, useNavigate } from "react-router";
import { GenreData } from "../../types/deezer.types";
import { ExploreStyles, useExploreStyles } from "./explore.styles";

interface InnerProps extends WithStyles<typeof ExploreStyles> {
  navigate: NavigateFunction;
}

interface OuterProps {
  deezerGenre: GenreData;
  spotifyGenre: SpotifyApi.CategoryObject;
}

type Props = InnerProps & OuterProps;

class MappedGenresClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { spotifyGenre, deezerGenre, classes } = this.props;

    return (
      <Grid container={true} item={true} xs={12} style={{ paddingBottom: 32 }}>
        <Grid item={true} xs={12}>
          <Button style={{ color: "black", padding: 0 }}>
            <div className="tint-img">
              <img
                src={spotifyGenre.icons[0].url}
                alt={deezerGenre.name}
                style={{ maxWidth: 220, maxHeight: 220, objectFit: "scale-down" }}
              />
            </div>
          </Button>
        </Grid>
        <Grid item={true} xs={12}>
          <Button variant="text" className={classes.genreName}>
            <Typography color="white" fontSize={20} fontWeight={200} fontFamily="Poppins,sans-serif">
              {spotifyGenre.name}
            </Typography>
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export const MappedGenres = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();
  const classes = useExploreStyles();

  return <MappedGenresClass classes={classes} {...props} navigate={navigate} />;
});