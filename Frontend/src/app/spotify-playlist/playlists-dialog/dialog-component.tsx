import * as React from "react";
import ChevronDown from "mdi-material-ui/ChevronDown";
import Spotify from "mdi-material-ui/Spotify";
import PlayCircleOutline from "mdi-material-ui/PlayCircleOutline";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";

interface OuterProps {
  spotifyPlaylists?: SpotifyApi.ListOfUsersPlaylistsResponse;
  youtubePlaylists?: gapi.client.youtube.PlaylistListResponse;
}

interface State {
  expanded: string | false;
}

class DialogContentDialogClass extends React.PureComponent<OuterProps, State> {
  public state: State = { expanded: false };

  private handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    this.setState({ expanded: isExpanded ? panel : false });
  };

  public render(): React.ReactNode {
    // const { playlist } = this.props;
    const { expanded } = this.state;

    // return (
    //   <Grid container={true}>
    //     <Grid item={true} xs={12}>
    //       <FormGroup>
    //         <FormControlLabel control={<Checkbox />} label={playlist.name} />
    //       </FormGroup>
    //     </Grid>
    //   </Grid>
    // );

    return (
      <>
        <Accordion expanded={expanded === "panel1"} onChange={this.handleChange("panel1")} style={{ minWidth: 250 }}>
          <AccordionSummary expandIcon={<ChevronDown />} aria-controls="panel1bh-content" id="panel1bh-header">
            <Typography style={{ float: "left", flexShrink: 0, width: "80%" }}>Spotify Playlists</Typography>
            <Spotify style={{ paddingLeft: 8, color: "#1DB954" }} />
          </AccordionSummary>
          <AccordionDetails>
            <Typography>playlists.</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === "panel2"} onChange={this.handleChange("panel2")}>
          <AccordionSummary expandIcon={<ChevronDown />} aria-controls="panel2bh-content" id="panel2bh-header">
            <Typography style={{ float: "left", flexShrink: 0, width: "80%" }}>Youtube Playlists</Typography>
            <PlayCircleOutline style={{ paddingLeft: 8, color: "#FF0000" }} />
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Playlists.</Typography>
          </AccordionDetails>
        </Accordion>
      </>
    );
  }
}

// eslint-disable-next-line arrow-body-style
export const DialogContentDialog = React.memo<OuterProps>((props) => {
  return <DialogContentDialogClass {...props} />;
});
