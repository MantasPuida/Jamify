import { createStyles, makeStyles } from "@mui/styles";

export const FeaturedPlaylistsStyles = () =>
  createStyles({
    featuredPlaylistsGrid: {
      backgroundColor: "black",
      padding: "32px 0 24px 0",
      margin: "0 150px"
    },
    card: {
      width: 250,
      height: 350,
      float: "left",
      marginTop: 24,
      marginRight: 12,
      marginBottom: 24,
      marginLeft: 12
    },
    cardActionArea: {
      width: "100%",
      height: "100%",
      backgroundColor: "black"
    },
    cardContent: {
      paddingLeft: 0
    }
  });

export const useFeaturedPlaylistsStyles = makeStyles(FeaturedPlaylistsStyles);
