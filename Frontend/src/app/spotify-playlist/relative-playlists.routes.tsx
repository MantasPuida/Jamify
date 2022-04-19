import * as React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import SpotifyWebApi from "spotify-web-api-node";
import { useAppContext } from "../../context/app-context";
import { FeaturedPlaylistState } from "../Home/featured-playlists/featured-card";
import { AppRoutes } from "../routes/routes";
import { Playlist } from "./playlist-class";

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

interface InnerProps {
  locationId: string;
}

type Props = OuterProps & InnerProps;

class RelativePlaylistsRoutesClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { spotifyApi } = this.props;

    return (
      <Routes>
        <Route>
          <Route path=":id" element={<Playlist spotifyApi={spotifyApi} />} />
        </Route>
      </Routes>
    );
  }
}

export const RelativePlaylistsRoutes = React.memo<OuterProps>((props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setLoading } = useAppContext();
  const locationState = location.state as FeaturedPlaylistState;
  const { deezerAlbum, ownPlaylist, spotifyPlaylist, youtubePlaylist } = locationState;

  let locationId: string = "";

  if (deezerAlbum) {
    locationId = deezerAlbum.id.toString();
  } else if (ownPlaylist) {
    locationId = ownPlaylist.playlistId;
  } else if (spotifyPlaylist) {
    locationId = spotifyPlaylist.id;
  } else if (youtubePlaylist) {
    if (youtubePlaylist.id) {
      locationId = youtubePlaylist.id;
    } else {
      setLoading(false);
      return null;
    }
  }

  React.useEffect(() => {
    if (location.pathname === AppRoutes.Playlist) {
      navigate(AppRoutes.Home);
    }
  }, [location.pathname]);

  React.useEffect(() => {
    navigate(locationId, { state: locationState });
  }, [locationId]);

  return <RelativePlaylistsRoutesClass locationId={locationId} {...props} />;
});
