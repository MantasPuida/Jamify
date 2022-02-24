import * as React from "react";
import Menu from "@mui/material/Menu";
import { WithStyles } from "@mui/styles";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Cog from "mdi-material-ui/Cog";
import LogoutVariant from "mdi-material-ui/LogoutVariant";
import AccountCircleOutline from "mdi-material-ui/AccountCircleOutline";
import SpotifyWebApi from "spotify-web-api-node";
import { ButtonProps, Typography } from "@mui/material";
import { NavigateFunction, useNavigate } from "react-router";
import { useSpotifyAuth } from "../../../context/spotify-context";
import { useYoutubeAuth } from "../../../context/youtube-context";
import { useDeezerAuth } from "../../../context/deezer-context";
import { AppRoutes } from "../../routes/routes";
import { HeaderStyles, useHeaderStyles } from "./header.styles";
import { SettingsDialog } from "./header-settings-dialog";

import "./fontFamily.css";

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
}

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

type Props = InnerProps & OuterProps;

class AccountMenuClass extends React.PureComponent<Props> {
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

  private handleLogoutSpotify = () => {
    const { logoutSpotify, navigate } = this.props;

    logoutSpotify();
    navigate(AppRoutes.Dashboard);
  };

  private handleLogoutYoutube = () => {
    const { logoutYoutube, navigate } = this.props;

    logoutYoutube();
    navigate(AppRoutes.Dashboard);
  };

  private handleLogoutDeezer = () => {
    const { logoutDeezer, navigate } = this.props;

    logoutDeezer();
    navigate(AppRoutes.Dashboard);
  };

  private handleOnLogout: MenuItemProps["onClick"] = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.handleLogoutDeezer();
    this.handleLogoutSpotify();
    this.handleLogoutYoutube();
  };

  public render(): React.ReactNode {
    const { anchorEl, classes, isDialogOpen, spotifyApi } = this.props;
    const isMenuOpen = Boolean(anchorEl);

    return (
      <>
        <IconButton
          onClick={this.handleClick}
          className={classes.headerMenuIconButton}
          aria-controls={isMenuOpen ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={isMenuOpen ? "true" : undefined}
        >
          <AccountCircleOutline className={classes.headerMenuIcon} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={this.handleClose}
          onClick={this.handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={this.handleDialogOpen}>
            <ListItemIcon>
              <Cog fontSize="small" className={classes.listItemIcon} />
            </ListItemIcon>
            <Typography fontFamily="Poppins,sans-serif" fontSize={24} color="black">
              Settings
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
        </Menu>
        <SettingsDialog
          isDialogOpen={isDialogOpen}
          handleDialogClose={this.handleDialogClose}
          spotifyApi={spotifyApi}
        />
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
  const classes = useHeaderStyles();

  return (
    <AccountMenuClass
      isDialogOpen={isDialogOpen}
      setDialogOpen={setDialogOpen}
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
      navigate={navigate}
      logoutSpotify={logoutSpotify}
      logoutYoutube={logoutYoutube}
      logoutDeezer={logoutDeezer}
      classes={classes}
      {...props}
    />
  );
});
