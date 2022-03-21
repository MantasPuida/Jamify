import * as React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { SpotifyPlaylistsStyles, useSpotifyPlaylistsStyles } from "./playlists.styles";

import "./carousel-items.css";

interface OuterProps {
  image: string;
  name: string;
  id: string | number;
}

interface InnerProps extends WithStyles<typeof SpotifyPlaylistsStyles> {}

type Props = InnerProps & OuterProps;

class PlaylistCardClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { classes, id, name, image } = this.props;

    if (!id || !image || !name) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    return (
      <Grid container={true} item={true} xs={12} key={id}>
        <Grid container={true} item={true} xs={12}>
          <Grid item={true}>
            <Button style={{ color: "transparent", paddingLeft: 0 }}>
              <div className="tint-img">
                <img src={image} alt={name} className={classes.image} height={160} width={160} />
              </div>
            </Button>
          </Grid>
          <Grid item={true} xs={12}>
            <Button className={classes.featuredText}>
              <Typography className={classes.carouselItemText} fontFamily="Poppins,sans-serif" color="white">
                {name}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const PlaylistCard = React.memo<OuterProps>((props) => {
  const classes = useSpotifyPlaylistsStyles();

  return <PlaylistCardClass {...props} classes={classes} />;
});
