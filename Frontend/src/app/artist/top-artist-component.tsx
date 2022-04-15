import * as React from "react";
import { Button, Grid, Typography, ButtonProps } from "@mui/material";
import { WithStyles } from "@mui/styles";
import Play from "mdi-material-ui/Play";
import { useLocation } from "react-router";
import memoizeOne from "memoize-one";
import { Albums, Artist, ArtistAlbumsResponse, ArtistResponse, PlaylistTracksResponse } from "../../types/deezer.types";
import { ArtistStyles, useArtistStyles } from "./artist.styles";
import { TrackObject, usePlayerContext } from "../../context/player-context";

interface OuterProps {
  chartArtist: Artist;
  artistData?: ArtistResponse;
}

interface TrackType {
  trackId: string;
  trackName: string;
  imageUrl: string;
  artists: string;
  duration: string;
  album: string;
}

type SpotifyPlaylistTracksResponse = SpotifyApi.PlaylistTrackResponse;

type PlaylistTracksType =
  | SpotifyPlaylistTracksResponse
  | gapi.client.youtube.PlaylistItemListResponse
  | TrackType[]
  | ArtistAlbumsResponse
  | PlaylistTracksResponse;

interface QueueType {
  queue: PlaylistTracksType | undefined;
  source: "spotify" | "youtube" | "deezer" | "own";
}

interface InnerProps extends WithStyles<typeof ArtistStyles> {
  albumList?: Albums;
  queue: QueueType | undefined;
  setQueue: React.Dispatch<React.SetStateAction<QueueType | undefined>>;
  setOpen: Function;
  setTrack: Function;
  isOpen: boolean;
}

type Props = InnerProps & OuterProps;

class TopArtistComponentClass extends React.PureComponent<Props> {
  private normalizeNumber: (value: number) => string = memoizeOne((value) =>
    value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );

  private handleOnClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { albumList, queue, setQueue, setOpen, setTrack, isOpen, chartArtist } = this.props;

    const currentAlbum = albumList?.data[0];

    if (currentAlbum) {
      DZ.api(`album/${currentAlbum.id}/tracks`, (response) => {
        const data = response as ArtistAlbumsResponse;
        const firstRecord = data.data[0];

        if (queue?.queue !== data) {
          setQueue({
            queue: data,
            source: "deezer"
          });
        }

        gapi.client.youtube.search
          .list({
            part: "snippet",
            q: `${firstRecord.title} ${firstRecord.artist.name ?? ""}`
          })
          .then((value) => {
            if (value.result.items && value.result.items[0].id?.videoId) {
              const currentTrack: TrackObject = {
                videoId: value.result.items[0].id.videoId,
                title: firstRecord.title_short ?? "",
                thumbnail: chartArtist.picture_xl ?? "",
                channelTitle: currentAlbum.title ?? ""
              };

              if (!isOpen) {
                setOpen(true);
              }
              setTrack(currentTrack);
            }
          });
      });
    }
  };

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
              onClick={this.handleOnClick}
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
  const location = useLocation();
  const [albumList, setAlbumList] = React.useState<Albums>();
  const { queue, setQueue, setOpen, setTrack, isOpen } = usePlayerContext();

  const { chartArtist } = props;

  React.useEffect(() => {}, [location]);
  DZ.api(`artist/${chartArtist.id}/albums&limit=50`, (response) => {
    setAlbumList(response as Albums);
  });

  return (
    <TopArtistComponentClass
      queue={queue}
      setQueue={setQueue}
      setOpen={setOpen}
      setTrack={setTrack}
      isOpen={isOpen}
      albumList={albumList}
      classes={classes}
      {...props}
    />
  );
});
