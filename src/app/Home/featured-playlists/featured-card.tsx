import * as React from "react";
import { Card, CardActionArea, CardActionAreaProps, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { NavigateFunction, useNavigate } from "react-router";
import { FeaturedPlaylistsStyles, useFeaturedPlaylistsStyles } from "./featured.styles";
import { AppRoutes } from "../../routes/routes";

interface OuterProps {
  playlist: SpotifyApi.PlaylistObjectSimplified;
}

interface InnerProps extends WithStyles<typeof FeaturedPlaylistsStyles> {
  navigate: NavigateFunction;
}

export interface FeaturedPlaylistState {
  playlist: SpotifyApi.PlaylistObjectSimplified;
}

type Props = InnerProps & OuterProps;

class FeaturedCardClass extends React.PureComponent<Props> {
  private parseDescription = (description: string | null): string | null => {
    if (description) {
      if (description.includes("<") || description.includes(">")) {
        const regex: RegExp = /<[^>]*>/gm;
        return description.replaceAll(regex, "");
      }

      return description;
    }

    return null;
  };

  private handleOnCardClick: CardActionAreaProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate, playlist } = this.props;

    navigate(AppRoutes.Playlist, { state: { playlist } as FeaturedPlaylistState });
  };

  public render(): React.ReactNode {
    const { classes, playlist } = this.props;

    return (
      <Grid item={true} key={playlist.id}>
        <Card className={classes.card}>
          <CardActionArea className={classes.cardActionArea} onClick={this.handleOnCardClick}>
            <CardMedia component="img" image={playlist.images[0].url} alt={playlist.name} />
            <CardContent className={classes.cardContent}>
              <Typography
                gutterBottom={true}
                fontFamily="Poppins,sans-serif"
                fontSize={19}
                variant="h5"
                component="div"
                color="white"
              >
                {playlist.name}
              </Typography>
              <Typography variant="body2" fontSize={14} color="lightgray">
                {this.parseDescription(playlist.description)}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );
  }
}

export const FeaturedCard = React.memo<OuterProps>((props) => {
  const navigate = useNavigate();
  const classes = useFeaturedPlaylistsStyles();

  return <FeaturedCardClass {...props} navigate={navigate} classes={classes} />;
});
