import * as React from "react";
import { Button, ButtonProps, Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { NavigateFunction, useNavigate } from "react-router";
import { Artist } from "../../../types/deezer.types";
import { DeezerStyles, useDeezerStyles } from "./deezer.styles";
import { AppRoutes } from "../../routes/routes";
import { useAppContext } from "../../../context/app-context";

interface OuterProps {
  artist: Artist;
  changeState: () => void;
  loading: boolean;
}

interface InnerProps extends WithStyles<typeof DeezerStyles> {
  navigate: NavigateFunction;
  setLoading: Function;
}

type Props = InnerProps & OuterProps;

class ArtistCardsClass extends React.PureComponent<Props> {
  componentDidMount() {
    const { setLoading, changeState } = this.props;

    setTimeout(() => {
      changeState();
      setLoading(false);
    }, 1000);
  }

  private handleOnClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate, artist } = this.props;

    navigate(AppRoutes.Artist, { state: { artist } });
  };

  public render(): React.ReactNode {
    const { artist, classes, loading } = this.props;

    if (loading) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    return (
      <Grid container={true}>
        <Grid container={true} item={true} xs={12} style={{ justifyContent: "center" }}>
          <Grid item={true} xs={12}>
            <Button
              style={{ padding: 0, backgroundColor: "transparent", width: 220, height: 220 }}
              onClick={this.handleOnClick}>
              <div id="tintImg" className="tint-img">
                <img src={artist.picture_xl} alt={artist.name} className={classes.image} />
              </div>
            </Button>
          </Grid>
          <Grid item={true} xs={8}>
            <Button className={classes.artistText} onClick={this.handleOnClick}>
              <Typography
                style={{ paddingTop: 8 }}
                fontSize={18}
                fontWeight={400}
                fontFamily="Poppins,sans-serif"
                textTransform="none"
                color="white">
                {artist.name}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const ArtistCards = React.memo<OuterProps>((props) => {
  const classes = useDeezerStyles();
  const navigate = useNavigate();
  const { setLoading } = useAppContext();

  return <ArtistCardsClass setLoading={setLoading} classes={classes} navigate={navigate} {...props} />;
});
