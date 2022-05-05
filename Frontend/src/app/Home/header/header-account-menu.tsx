import * as React from "react";
import {
  Divider,
  ButtonProps,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Menu from "@mui/material/Menu";
import { WithStyles } from "@mui/styles";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Cog from "mdi-material-ui/Cog";
import AccountCancel from "mdi-material-ui/AccountCancel";
import LogoutVariant from "mdi-material-ui/LogoutVariant";
import AccountCircleOutline from "mdi-material-ui/AccountCircleOutline";
import SpotifyWebApi from "spotify-web-api-node";
import { NavigateFunction, useNavigate } from "react-router";
import { useSpotifyAuth } from "../../../context/spotify-context";
import { useYoutubeAuth } from "../../../context/youtube-context";
import { useDeezerAuth } from "../../../context/deezer-context";
import { AppRoutes } from "../../routes/routes";
import { HeaderStyles, useHeaderStyles } from "./header.styles";
import { SettingsDialog } from "./header-settings-dialog";

import "./fontFamily.css";
import { useAppContext } from "../../../context/app-context";
import { Timer } from "./timer";
import { useUserContext } from "../../../context/user-context";
import { PlaylistApi } from "../../../api/api-endpoints";

type LogoutFunctionType = () => void;

interface InnerProps extends WithStyles<typeof HeaderStyles> {
  anchorEl: null | HTMLElement;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  isDialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: NavigateFunction;
  logoutYoutube: LogoutFunctionType;
  logoutSpotify: LogoutFunctionType;
  logoutDeezer: LogoutFunctionType;
  setIsOnline: Function;
  setUserId: Function;
  userId: string | undefined;
}

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

type Props = InnerProps & OuterProps;

interface State {
  deleteDialogAnchorEl: null | HTMLElement;
  isButtonDisabled: boolean;
}

class AccountMenuClass extends React.PureComponent<Props, State> {
  public state: State = { deleteDialogAnchorEl: null, isButtonDisabled: false };

  private handleDialogClose: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { setDialogOpen } = this.props;

    setDialogOpen(false);
  };

  private handleDialogOpen: MenuItemProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { setDialogOpen } = this.props;

    this.handleClose();
    setDialogOpen(true);
  };

  private handleClose = () => {
    const { setAnchorEl } = this.props;
    setAnchorEl(null);
  };

  private handleClick: IconButtonProps["onClick"] = (event) => {
    const { setAnchorEl } = this.props;
    setAnchorEl(event.currentTarget);
  };

  private handleOnLogout: MenuItemProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { setIsOnline, navigate } = this.props;
    setIsOnline(false);
    navigate(AppRoutes.Dashboard);
  };

  private handleOnDeleteDialog: MenuItemProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({ deleteDialogAnchorEl: event.currentTarget, isButtonDisabled: true });

    setTimeout(() => this.setState({ isButtonDisabled: false }), 5000);
  };

  private handleDeleteDialogClose: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({ deleteDialogAnchorEl: null });
  };

  private handleDeleteAccount: ButtonProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { navigate, userId, setUserId, setIsOnline } = this.props;

    if (userId) {
      PlaylistApi.UserApiEndpoints()
        .deleteUser(userId)
        .then(() => {
          setUserId(undefined);
          setIsOnline(false);
          navigate(AppRoutes.Dashboard);
        });
    }
  };

  public render(): React.ReactNode {
    const { anchorEl, classes, isDialogOpen, spotifyApi } = this.props;
    const { deleteDialogAnchorEl, isButtonDisabled } = this.state;
    const isDeleteDialogOpen = Boolean(deleteDialogAnchorEl);
    const isMenuOpen = Boolean(anchorEl);

    return (
      <>
        <IconButton
          onClick={this.handleClick}
          className={classes.headerMenuIconButton}
          aria-controls={isMenuOpen ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={isMenuOpen ? "true" : undefined}>
          <AccountCircleOutline className={classes.headerMenuIcon} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={this.handleClose}
          onClick={this.handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
          <MenuItem onClick={this.handleDialogOpen}>
            <ListItemIcon>
              <Cog fontSize="small" className={classes.listItemIcon} />
            </ListItemIcon>
            <Typography fontFamily="Poppins,sans-serif" fontSize={24} color="black">
              Profile
            </Typography>
          </MenuItem>
          <MenuItem onClick={this.handleOnLogout}>
            <ListItemIcon>
              <LogoutVariant fontSize="small" className={classes.listItemIcon} />
            </ListItemIcon>
            <Typography fontFamily="Poppins,sans-serif" fontSize={24} color="black">
              Logout
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={this.handleOnDeleteDialog}>
            <ListItemIcon>
              <AccountCancel fontSize="small" className={classes.listItemIcon} />
            </ListItemIcon>
            <Typography fontFamily="Poppins,sans-serif" fontSize={24} color="black">
              Delete
            </Typography>
          </MenuItem>
        </Menu>
        <SettingsDialog
          isDialogOpen={isDialogOpen}
          handleDialogClose={this.handleDialogClose}
          spotifyApi={spotifyApi}
        />
        <Dialog open={isDeleteDialogOpen} onClose={this.handleDeleteDialogClose}>
          <DialogTitle id="Delete Dialog Title" style={{ paddingBottom: 0 }}>
            <Typography fontFamily="Poppins, sans-serif" fontWeight={800} fontSize={16}>
              Do you want to <b>Delete</b> your account?
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography style={{ color: "black" }} fontFamily="Poppins, sans-serif" fontWeight={500} fontSize={14}>
                This action cannot be undone.
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Grid container={true}>
              <Grid container={true} item={true} xs={12} style={{ textAlign: "center" }}>
                <Grid item={true} xs={6}>
                  <LoadingButton variant="text" onClick={this.handleDeleteDialogClose}>
                    <Typography
                      className={classes.deleteDialogCancelButton}
                      fontFamily="Poppins, sans-serif"
                      fontWeight={500}
                      fontSize={14}>
                      Cancel
                    </Typography>
                  </LoadingButton>
                </Grid>
                <Grid item={true} xs={6}>
                  <LoadingButton
                    sx={{
                      "&:disabled": {
                        color: "red",
                        borderColor: "red"
                      }
                    }}
                    disabled={isButtonDisabled}
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={this.handleDeleteAccount}>
                    <Typography
                      className={classes.deleteDialogDeleteButton}
                      fontFamily="Poppins, sans-serif"
                      fontWeight={500}
                      fontSize={14}>
                      <Timer initialSeconds={5} />
                    </Typography>
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export const AccountMenu = React.memo<OuterProps>((props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isDialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const { logout: logoutSpotify } = useSpotifyAuth();
  const { logout: logoutYoutube } = useYoutubeAuth();
  const { logout: logoutDeezer } = useDeezerAuth();
  const { userId, setUserId } = useUserContext();
  const { setIsOnline } = useAppContext();
  const classes = useHeaderStyles();

  return (
    <AccountMenuClass
      isDialogOpen={isDialogOpen}
      setDialogOpen={setDialogOpen}
      anchorEl={anchorEl}
      setIsOnline={setIsOnline}
      setAnchorEl={setAnchorEl}
      navigate={navigate}
      logoutSpotify={logoutSpotify}
      logoutYoutube={logoutYoutube}
      logoutDeezer={logoutDeezer}
      userId={userId}
      setUserId={setUserId}
      classes={classes}
      {...props}
    />
  );
});
