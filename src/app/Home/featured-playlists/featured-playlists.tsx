/* eslint-disable react/no-array-index-key */
import * as React from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { WithStyles } from "@mui/styles";
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { FeaturedPlaylistsStyles, useFeaturedPlaylistsStyles } from "./featured.styles";
import { useSpotifyAuth } from "../../../context/spotify-context";

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

type FeaturedPlaylist = SpotifyApi.ListOfFeaturedPlaylistsResponse;

interface InnerProps extends WithStyles<typeof FeaturedPlaylistsStyles> {
  featuredPlaylists?: FeaturedPlaylist;
}

type Props = OuterProps & InnerProps;

class FeaturedPlaylistsClass extends React.PureComponent<Props> {
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

  public render(): React.ReactNode {
    const { classes, featuredPlaylists } = this.props;

    if (!featuredPlaylists) {
      return <>nothing</>;
    }

    const { message, playlists } = featuredPlaylists;

    // eslint-disable-next-line consistent-return
    return (
      <Grid container={true} item={true} xs={12} className={classes.featuredPlaylistsGrid}>
        <Grid container={true}>
          <Grid item={true} xs={12}>
            <Typography fontSize={45} fontWeight={900} fontFamily="Poppins,sans-serif">
              Featured Playlists
            </Typography>
            <Typography fontSize={25} fontWeight={400} fontFamily="Poppins,sans-serif">
              {message ?? "Editor's picks"}
            </Typography>
          </Grid>
          <Grid item={true} xs={12}>
            {playlists.items.map((x, index) => (
              <Grid item={true} key={index}>
                <Card
                  style={{ width: 250, height: 375, float: "left", marginTop: 24, marginRight: 24, marginBottom: 24 }}
                >
                  <CardActionArea style={{ width: "100%", height: "100%" }}>
                    <CardMedia component="img" image={x.images[0].url} alt="green iguana" />
                    <CardContent>
                      <Typography gutterBottom={true} variant="h5" component="div">
                        {x.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {this.parseDescription(x.description)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const FeaturedPlaylists = React.memo<OuterProps>((props) => {
  const classes = useFeaturedPlaylistsStyles();
  const { spotifyToken } = useSpotifyAuth();
  const [featuredObj, setFeaturedObj] = React.useState<undefined | FeaturedPlaylist>();
  const { spotifyApi } = props;

  React.useEffect(() => {
    if (spotifyToken) {
      spotifyApi
        .getFeaturedPlaylists({
          locale: "en"
        })
        .then((value) => {
          setFeaturedObj(value.body);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [spotifyApi]);

  return <FeaturedPlaylistsClass classes={classes} spotifyApi={spotifyApi} featuredPlaylists={featuredObj} />;
});
