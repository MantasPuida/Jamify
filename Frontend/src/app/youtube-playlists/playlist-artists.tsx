import * as React from "react";
import { Button, ButtonProps, Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { NavigateFunction, useNavigate } from "react-router";
import { YoutubeTracksStyles, useYoutubeTracksStyles } from "./playlist.styles";
import { extractThumbnail } from "../../helpers/thumbnails";
import { useAppContext } from "../../context/app-context";

interface OuterProps {
  artist: gapi.client.youtube.Channel;
  changeLoading: () => void;
}

interface InnerProps extends WithStyles<typeof YoutubeTracksStyles> {
  navigate: NavigateFunction;
  setLoading: Function;
}

type Props = InnerProps & OuterProps;

class PlaylistArtistsClass extends React.PureComponent<Props> {
  componentDidMount() {
    const { setLoading, changeLoading } = this.props;

    setLoading(false);
    setTimeout(() => {
      changeLoading();
    }, 1000);
  }

  private handleOnClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  public render(): React.ReactNode {
    const { artist, classes } = this.props;

    if (!artist.id || !artist.snippet || !artist.snippet.thumbnails || !artist.snippet.title) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    const { title, thumbnails } = artist.snippet;

    const imageUrl = extractThumbnail(thumbnails);

    return (
      <Grid container={true} key={artist.id}>
        <Grid container={true} item={true} xs={12} style={{ justifyContent: "center" }}>
          <Grid item={true} xs={12}>
            <Button style={{ padding: 0, backgroundColor: "transparent" }} onClick={this.handleOnClick}>
              <div id="tintImg" className="tint-img">
                <img src={imageUrl} alt={title} className={classes.ytArtistImage} />
              </div>
            </Button>
          </Grid>
          <Grid item={true} xs={8}>
            <Button className={classes.ytArtistText} onClick={this.handleOnClick}>
              <Typography
                style={{ paddingTop: 8 }}
                fontSize={18}
                fontWeight={400}
                fontFamily="Poppins,sans-serif"
                textTransform="none"
                color="white">
                {title}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const PlaylistArtists = React.memo<OuterProps>((props) => {
  const classes = useYoutubeTracksStyles();
  const navigate = useNavigate();
  const { setLoading } = useAppContext();

  return <PlaylistArtistsClass setLoading={setLoading} classes={classes} navigate={navigate} {...props} />;
});
