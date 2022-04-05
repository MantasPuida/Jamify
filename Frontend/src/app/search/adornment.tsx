import * as React from "react";
import { Select, MenuItem, SelectProps, IconButton, IconButtonProps, Grid } from "@mui/material";
import Magnify from "mdi-material-ui/Magnify";

import "./fontFamily.css";

type SourceType = "Tracks" | "Artists" | "Playlists" | "All";

interface OuterProps {
  source: SourceType;
  handleOnChange: SelectProps["onChange"];
  handleOnClick: IconButtonProps["onClick"];
}

export class EndAdornment extends React.PureComponent<OuterProps> {
  public render(): React.ReactNode {
    const { source, handleOnChange, handleOnClick } = this.props;

    return (
      <Grid container={true} style={{ textAlign: "end", maxWidth: 240 }}>
        <Grid item={true} xs={12}>
          <Select
            value={source}
            onChange={handleOnChange}
            sx={{
              color: "white",
              ".css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": { color: "white" },
              ".css-1mf6u8l-MuiSvgIcon-root-MuiSelect-icon": { color: "white" },
              "::after": {
                borderBottom: "2px solid white !important"
              },
              fontFamily: "Poppins,sans-serif",
              fontSize: 16
            }}>
            <MenuItem value="All" style={{ fontFamily: "Poppins,sans-serif", fontSize: 16 }}>
              All
            </MenuItem>
            <MenuItem value="Tracks" style={{ fontFamily: "Poppins,sans-serif", fontSize: 16 }}>
              Tracks
            </MenuItem>
            <MenuItem value="Artists" style={{ fontFamily: "Poppins,sans-serif", fontSize: 16 }}>
              Artists
            </MenuItem>
            <MenuItem value="Playlists" style={{ fontFamily: "Poppins,sans-serif", fontSize: 16 }}>
              Playlists
            </MenuItem>
          </Select>
          <IconButton onClick={handleOnClick}>
            <Magnify style={{ color: "white", paddingLeft: 16 }} fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
    );
  }
}
