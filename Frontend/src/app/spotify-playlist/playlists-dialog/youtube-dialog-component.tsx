import { Checkbox, FormControlLabel, FormGroup, Grid } from "@mui/material";
import * as React from "react";

interface OuterProps {
  playlist: gapi.client.youtube.Playlist;
}

class YoutubeDialogContentClass extends React.PureComponent<OuterProps> {
  public render(): React.ReactNode {
    const { playlist } = this.props;

    if (!playlist.snippet || !playlist.snippet.title) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    return (
      <Grid container={true}>
        <Grid item={true} xs={12}>
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label={playlist.snippet.title} />
          </FormGroup>
        </Grid>
      </Grid>
    );
  }
}

// eslint-disable-next-line arrow-body-style
export const YoutubeDialogContent = React.memo<OuterProps>((props) => {
  return <YoutubeDialogContentClass {...props} />;
});
