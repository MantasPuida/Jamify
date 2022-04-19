import { createStyles, makeStyles } from "@mui/styles";

export const PlayerStyles = () =>
  createStyles({
    slider: {
      color: "#fff",
      height: 4,
      marginBottom: 16,
      zIndex: 10,
      padding: 0,
      "& .MuiSlider-thumb": {
        width: 8,
        height: 8,
        transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
        "&:before": {
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)"
        },
        "&:hover, &.Mui-focusVisible": {
          boxShadow: "0px 0px 0px 8px rgb(255 255 255 / 16%)"
        },
        "&.Mui-active": {
          width: 20,
          height: 20
        }
      },
      "& .MuiSlider-rail": {
        opacity: 0.28
      }
    },
    volumeSlider: {
      color: "#fff",
      width: 54,
      marginLeft: 16,
      "& .MuiSlider-track": {
        border: "none"
      },
      "& .MuiSlider-thumb": {
        width: 16,
        height: 16,
        backgroundColor: "#fff",
        "&:before": {
          boxShadow: "0 4px 8px rgba(0,0,0,0.4)"
        },
        "&:hover, &.Mui-focusVisible, &.Mui-active": {
          boxShadow: "none"
        }
      }
    },
    volumeIcon: {
      color: "rgba(255,255,255,0.4)"
    }
  });

export const usePlayerStyles = makeStyles(PlayerStyles);
