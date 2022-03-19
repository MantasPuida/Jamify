import * as React from "react";
import Play from "mdi-material-ui/Play";
import { Button, ButtonProps, TableCell, TableRow, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { TrackObject, usePlayerContext } from "../../context/player-context";
import { PlaylistStyles, usePlaylistStyles } from "./playlist.styles";

interface OuterProps {
  row: SpotifyApi.PlaylistTrackObject;
}

interface InnerProps extends WithStyles<typeof PlaylistStyles> {
  setTrack: Function;
  setOpen: Function;
}

type Props = InnerProps & OuterProps;

class TracksTableContentClass extends React.PureComponent<Props> {
  private handleOnTrackClick: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { row, setTrack, setOpen } = this.props;
    gapi.client.youtube.search
      .list({
        part: "snippet",
        q: row.track.name
      })
      .then((value) => {
        if (value.result.items && value.result.items[0].id?.videoId) {
          const currentTrack: TrackObject = {
            channelTitle: row.track.album.name,
            thumbnail: row.track.album.images[0].url,
            title: row.track.name,
            videoId: value.result.items[0].id.videoId
          };

          setOpen(true);
          setTrack(currentTrack);
        }
      });
  };

  private convertMilliseconds = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);

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
    const { row, classes } = this.props;

    return (
      <TableRow classes={{ hover: classes.hover }} hover={true} role="checkbox" tabIndex={-1} key={row.track.id}>
        <TableCell key={row.track.id} style={{ paddingLeft: 0, minWidth: 350, maxWidth: 550 }}>
          <Button style={{ padding: 0, color: "transparent" }} onClick={this.handleOnTrackClick}>
            <img
              className={classes.playlistImageStyle}
              src={row.track.album.images[0].url}
              alt={row.track.name}
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
              color="white"
            >
              {row.track.name}
            </Typography>
          </Button>
        </TableCell>
        <TableCell className={classes.artistTableCell}>
          <Button className={classes.buttonTextHover} variant="text">
            <Typography fontFamily="Poppins, sans-serif" fontSize={16} className={classes.artistTypography}>
              {row.track.artists.map((artist, index) => {
                const { length } = row.track.artists;
                if (length > 1 && index < length - 1) {
                  return `${artist.name}, `;
                }
                return artist.name;
              })}
            </Typography>
          </Button>
        </TableCell>
        <TableCell style={{ minWidth: 500 }}>
          <Button className={classes.buttonTextHover} variant="text">
            <Typography fontFamily="Poppins, sans-serif" fontSize={16} className={classes.artistTypography}>
              {row.track.album.name}
            </Typography>
          </Button>
        </TableCell>
        <TableCell style={{ textAlign: "end" }}>
          <Typography fontFamily="Poppins, sans-serif" fontSize={16} className={classes.artistTypography}>
            {this.convertMilliseconds(row.track.duration_ms)}
          </Typography>
        </TableCell>
      </TableRow>
    );
  }
}

export const TracksTableContent = React.memo<OuterProps>((props) => {
  const { setTrack, setOpen } = usePlayerContext();
  const classes = usePlaylistStyles();

  return <TracksTableContentClass {...props} setTrack={setTrack} setOpen={setOpen} classes={classes} />;
});
