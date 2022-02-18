import { createStyles, makeStyles } from "@mui/styles";

export const FeaturedPlaylistsStyles = () =>
  createStyles({
    featuredPlaylistsGrid: {
      backgroundColor: "white",
      padding: "32px 0 24px 0",
      margin: "0 53px"
    }
  });

export const useFeaturedPlaylistsStyles = makeStyles(FeaturedPlaylistsStyles);
