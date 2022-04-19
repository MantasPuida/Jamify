import * as React from "react";
import { Button, ButtonProps, Grid, Paper, Table, TableBody, TableContainer, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { useLocation } from "react-router";
import SpotifyWebApi from "spotify-web-api-node";
import { Artist, ArtistResponse, TrackListResponse, TrackListData, Album, Albums } from "../../types/deezer.types";
import { ArtistStyles, useArtistStyles } from "./artist.styles";
import { ArtistTrackTable } from "./artist-tracks-table";
import { ArtistAlbums } from "./artist-albums";
import { useAppContext } from "../../context/app-context";

interface OuterProps {
  chartArtist: Artist;
  artistData?: ArtistResponse;
  spotifyApi: SpotifyWebApi;
}

interface InnerProps extends WithStyles<typeof ArtistStyles> {
  trackList?: TrackListResponse;
  albumList?: Albums;
  setLoading: Function;
}

type Props = InnerProps & OuterProps;

interface State {
  isClickedTracks: boolean;
  isClickedAlbums: boolean;
}

class ArtistContentClass extends React.PureComponent<Props, State> {
  public state: State = { isClickedTracks: false, isClickedAlbums: false };

  componentDidMount() {
    const { setLoading } = this.props;

    setLoading(false);
  }

  private handleOnShowMoreTracks: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState((state) => ({ isClickedTracks: !state.isClickedTracks }));
  };

  private handleOnShowMoreAlbums: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState((state) => ({ isClickedAlbums: !state.isClickedAlbums }));
  };

  public render(): React.ReactNode {
    const { classes, trackList, albumList, spotifyApi } = this.props;
    const { isClickedTracks, isClickedAlbums } = this.state;

    if (!trackList) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    return (
      <Grid container={true} className={classes.artistGrid}>
        {!isClickedAlbums && (
          <Grid item={true} xs={12}>
            <Typography fontFamily="Poppins, sans-serif" color="white" fontSize={30}>
              Top Tracks
            </Typography>
            <Paper className={classes.artistPaperStyles}>
              <TableContainer>
                <Table>
                  <TableBody>
                    {trackList.data.map((track: TrackListData, index) => {
                      if (index > 4 && !isClickedTracks) {
                        // eslint-disable-next-line react/jsx-no-useless-fragment
                        return <React.Fragment key={track.id} />;
                      }

                      return (
                        <ArtistTrackTable spotifyApi={spotifyApi} albumList={albumList} track={track} key={track.id} />
                      );
                    })}
                  </TableBody>
                  <Grid style={{ paddingTop: 16 }}>
                    {trackList.data.length > 4 && (
                      <Button
                        variant="outlined"
                        style={{ backgroundColor: "white", color: "black", borderColor: "white", borderRadius: 15 }}
                        onClick={this.handleOnShowMoreTracks}>
                        <Typography fontFamily="Poppins, sans-serif">
                          Show {isClickedTracks ? "Less" : "More"} Tracks
                        </Typography>
                      </Button>
                    )}
                  </Grid>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}
        {!isClickedTracks && (
          <Grid item={true} xs={12} className={classes.artistPaperStyles}>
            <Typography fontFamily="Poppins, sans-serif" color="white" fontSize={30}>
              Albums
            </Typography>
            <Grid container={true}>
              {albumList?.data.map((album: Album, index) => {
                if (index > 11 && !isClickedAlbums) {
                  return <React.Fragment key={album.id} />;
                }

                return <ArtistAlbums album={album} key={album.id} />;
              })}
            </Grid>
            {albumList && albumList.data.length > 11 && (
              <Button
                variant="outlined"
                style={{ backgroundColor: "white", color: "black", borderColor: "white", borderRadius: 15 }}
                onClick={this.handleOnShowMoreAlbums}>
                <Typography fontFamily="Poppins, sans-serif">
                  Show {isClickedAlbums ? "Less" : "More"} Albums
                </Typography>
              </Button>
            )}
          </Grid>
        )}
      </Grid>
    );
  }
}

export const ArtistContent = React.memo<OuterProps>((props) => {
  const [trackList, setTrackList] = React.useState<TrackListResponse>();
  const [albumList, setAlbumList] = React.useState<Albums>();
  const classes = useArtistStyles();
  const location = useLocation();
  const { setLoading } = useAppContext();
  const { chartArtist } = props;

  React.useEffect(() => {
    DZ.api(`artist/${chartArtist.id}/top?limit=50`, (response) => {
      setTrackList(response as TrackListResponse);
    });

    DZ.api(`artist/${chartArtist.id}/albums&limit=50`, (response) => {
      setAlbumList(response as Albums);
    });
  }, [location.pathname]);

  return (
    <ArtistContentClass
      setLoading={setLoading}
      albumList={albumList}
      trackList={trackList}
      classes={classes}
      {...props}
    />
  );
});
