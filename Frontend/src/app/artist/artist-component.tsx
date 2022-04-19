import * as React from "react";
import { Grid } from "@mui/material";
import { useLocation } from "react-router";
import SpotifyWebApi from "spotify-web-api-node";
import { Artist as ArtistType, ArtistResponse } from "../../types/deezer.types";
import { TopArtistComponent } from "./top-artist-component";
import { ArtistContent } from "./artist-content-component";

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

interface InnerProps {
  chartArtist: ArtistType;
  artistData?: ArtistResponse;
}

type Props = OuterProps & InnerProps;

class ArtistClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { chartArtist, artistData, spotifyApi } = this.props;

    return (
      <Grid container={true} item={true} xs={12} style={{ backgroundColor: "black", overflowX: "hidden" }}>
        <TopArtistComponent chartArtist={chartArtist} artistData={artistData} />
        <ArtistContent chartArtist={chartArtist} artistData={artistData} spotifyApi={spotifyApi} />
      </Grid>
    );
  }
}

export const Artist = React.memo<OuterProps>((props) => {
  const [artistData, setArtistData] = React.useState<ArtistResponse>();
  const location = useLocation();
  const locationState = location.state as { artist: ArtistType };
  const { artist } = locationState;

  if (!artist.id) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  React.useEffect(() => {
    DZ.api(`artist/${artist.id}`, (response) => {
      setArtistData(response);
    });
  }, [location]);

  return <ArtistClass chartArtist={artist} artistData={artistData} {...props} />;
});
