import * as React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import Play from "mdi-material-ui/Play";
import memoizeOne from "memoize-one";
import { Artist, ArtistResponse } from "../../types/deezer.types";
import { ArtistStyles, useArtistStyles } from "./artist.styles";

interface OuterProps {
  chartArtist: Artist;
  artistData?: ArtistResponse;
}

interface InnerProps extends WithStyles<typeof ArtistStyles> {}

type Props = InnerProps & OuterProps;

class TopArtistComponentClass extends React.PureComponent<Props> {
  private normalizeNumber: (value: number) => string = memoizeOne((value) =>
    value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );

  public render(): React.ReactNode {
    const { chartArtist, artistData, classes } = this.props;
    const { picture_xl: picXl, name } = chartArtist;

    if (!artistData) {
      return null;
    }

    const numberOfFans = this.normalizeNumber(artistData.nb_fan);
    const numberOfAlbums = this.normalizeNumber(artistData.nb_album);

    return (
      <Grid container={true} className={classes.artistGrid}>
        <Grid item={true} xs={4} style={{ maxWidth: "35%" }}>
          <img src={picXl} alt={name} className={classes.artistImage} />
        </Grid>
        <Grid container={true} item={true} xs={8} className={classes.artistGridText}>
          <Grid item={true}>
            <Typography fontFamily="Poppins, sans-serif" color="white" fontWeight={700} fontSize={45}>
              {name}
            </Typography>
          </Grid>
          <Grid item={true} style={{ width: "100%" }}>
            <Typography fontWeight={400} fontSize={16} style={{ color: "rgba(255, 255, 255, .7)" }}>
              {numberOfFans} fans
            </Typography>
          </Grid>
          <Grid item={true} style={{ width: "100%" }}>
            <Typography fontWeight={400} fontSize={16} style={{ color: "rgba(255, 255, 255, .7)" }}>
              {numberOfAlbums} albums
            </Typography>
          </Grid>
          <Grid item={true} style={{ width: "100%", marginTop: 40 }}>
            <Button
              style={{
                textTransform: "none",
                justifyContent: "left",
                backgroundColor: "white",
                color: "black",
                minWidth: 80,
                minHeight: 40
              }}
              startIcon={<Play />}
              variant="contained">
              <Typography fontFamily="Poppins, sans-serif" color="black" fontWeight={500} fontSize={15}>
                Play
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const TopArtistComponent = React.memo<OuterProps>((props) => {
  const classes = useArtistStyles();

  return <TopArtistComponentClass classes={classes} {...props} />;
});
