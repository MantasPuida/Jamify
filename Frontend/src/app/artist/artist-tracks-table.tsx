import * as React from "react";
import { Button, ButtonProps, TableCell, TableRow, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import SpotifyWebApi from "spotify-web-api-node";
import Play from "mdi-material-ui/Play";
import { Albums, TrackListData } from "../../types/deezer.types";
import { ArtistStyles, useArtistStyles } from "./artist.styles";
import { TrackActionComponent } from "../spotify-playlist/track-actions-component";
import { SourceType } from "../spotify-playlist/playlist-component";
import { TrackObject, usePlayerContext } from "../../context/player-context";

interface OuterProps {
  track: TrackListData;
  albumList?: Albums;
  spotifyApi: SpotifyWebApi;
}

interface InnerProps extends WithStyles<typeof ArtistStyles> {
  setTrack: Function;
  isOpen: boolean;
  setOpen: Function;
}

type Props = InnerProps & OuterProps;

class ArtistTrackTableClass extends React.PureComponent<Props> {
  private handleOnClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { setTrack, setOpen, track } = this.props;

    gapi.client.youtube.search
      .list({
        part: "snippet",
        q: `${track.title} ${track.artist.name}`
      })
      .then((value) => {
        if (value.result.items && value.result.items[0].id?.videoId) {
          const currentTrack: TrackObject = {
            channelTitle: track.album.title,
            thumbnail: track.album.cover_xl,
            title: track.title,
            videoId: value.result.items[0].id.videoId
          };

          setOpen(true);
          setTrack(currentTrack);
        }
      });
  };

  private convertMilliseconds = (sec: number): string => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);

    let duration: string = minutes.toString();

    if (minutes < 10) {
      duration = `0${minutes}:`;
    }

    if (Number(seconds) < 10) {
      duration += `0${seconds}`;
    } else {
      duration += seconds;
    }

    return duration;
  };

  public render(): React.ReactNode {
    const { track, classes, albumList, spotifyApi } = this.props;

    return (
      <TableRow classes={{ hover: classes.hover }} hover={true} role="checkbox" tabIndex={-1} key={track.id}>
        <TableCell key={track.id} style={{ paddingLeft: 0, minWidth: 350, maxWidth: 550 }}>
          <Button style={{ padding: 0, color: "transparent" }} onClick={this.handleOnClick}>
            <img
              className={classes.playlistImageStyle}
              src={track.album.cover_xl}
              alt={track.title}
              width={40}
              id="rowTrackImage"
            />
            <div className={classes.playlistIconButton}>
              <Play id="playSvgIcon" className={classes.playlistIconButtonIcon} />
            </div>
          </Button>
          <Button className={classes.buttonText} variant="text">
            <Typography
              style={{ height: "100%", marginTop: 4, textAlign: "left", minWidth: 400 }}
              fontFamily="Poppins, sans-serif"
              fontSize={16}
              fontWeight={500}
              color="white">
              {track.title_short}
            </Typography>
          </Button>
        </TableCell>
        <TableCell className={classes.artistTableCell}>
          {albumList && (
            <TrackActionComponent
              sourceType={SourceType.Deezer}
              spotifyApi={spotifyApi}
              trackName={track.title_short}
              playlist={track.album}
              imageUrl={track.album.cover_xl}
              artists={track.artist.name}
              deezerTrack={track}
            />
          )}
          <Typography fontFamily="Poppins, sans-serif" fontSize={16} className={classes.artistTypography}>
            {this.convertMilliseconds(track.duration)}
          </Typography>
        </TableCell>
      </TableRow>
    );
  }
}

export const ArtistTrackTable = React.memo<OuterProps>((props) => {
  const classes = useArtistStyles();
  const { setTrack, isOpen, setOpen } = usePlayerContext();

  return <ArtistTrackTableClass classes={classes} isOpen={isOpen} setOpen={setOpen} setTrack={setTrack} {...props} />;
});
