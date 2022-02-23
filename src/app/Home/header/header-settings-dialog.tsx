import * as React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  BottomNavigationProps,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import Spotify from "mdi-material-ui/Spotify";
import PlayCircleOutline from "mdi-material-ui/PlayCircleOutline";

interface OuterProps {
  handleDialogClose: ButtonProps["onClick"];
  isDialogOpen: boolean;
}

interface InnerProps {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
}

type Props = InnerProps & OuterProps;

class SettingsDialogClass extends React.PureComponent<Props> {
  private handleNavigationChange: BottomNavigationProps["onChange"] = (event, newValue) => {
    event.preventDefault();
    event.stopPropagation();

    const { setValue } = this.props;

    setValue(newValue);
  };

  public render(): React.ReactNode {
    const { isDialogOpen, handleDialogClose, value } = this.props;

    return (
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Use Googles location service?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous location data to Google, even when no
            apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <BottomNavigation sx={{ width: "100%" }} value={value} onChange={this.handleNavigationChange}>
            <BottomNavigationAction label="Spotify" value="spotify" icon={<Spotify />} />
            <BottomNavigationAction label="Youtube" value="youtube" icon={<PlayCircleOutline />} />
            <BottomNavigationAction label="Deezer" value="deezer" icon={<Spotify />} />
          </BottomNavigation>
        </DialogActions>
      </Dialog>
    );
  }
}

export const SettingsDialog = React.memo<OuterProps>((props) => {
  const [value, setValue] = React.useState<string>("recents");

  return <SettingsDialogClass value={value} setValue={setValue} {...props} />;
});
