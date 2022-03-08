import * as React from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { NotFound } from "../errors/not-found-component";
import { Home } from "../Home/home-components";
import { AppRoutes } from "./routes";
import { useSpotifyAuth } from "../../context/spotify-context";
import { SpotifyConstants } from "../../constants/constants-spotify";
import { Explore } from "../explore/explore-component";
import { Search } from "../search/search-component";
import { Playlist } from "../spotify-playlist/playlist-class";
import { Helpers } from "../../utils/helpers";
import { HeaderComponent } from "../Home/header/header-component";
import { usePlayerContext } from "../../context/player-context";
import { Player } from "../player/player-component";

interface Props {
  spotifyApi: SpotifyWebApi;
  isPlayerOpen: boolean;
}

function HomeRoutesClass(props: Props) {
  const { spotifyApi, isPlayerOpen } = props;

  return (
    <>
      <HeaderComponent spotifyApi={spotifyApi} />
      <Routes>
        <Route path={AppRoutes.Home} element={<Home spotifyApi={spotifyApi} />} />
        <Route path={AppRoutes.Explore} element={<Explore spotifyApi={spotifyApi} />} />
        <Route path={AppRoutes.Search} element={<Search spotifyApi={spotifyApi} />} />
        <Route path={AppRoutes.Playlist} element={<Playlist spotifyApi={spotifyApi} />} />
        <Route path="*" element={<NotFound />} />;
      </Routes>
      {isPlayerOpen && <Player />}
    </>
  );
}

// eslint-disable-next-line react/function-component-definition
const HomeRoutes = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen } = usePlayerContext();
  const { spotifyToken, register } = useSpotifyAuth();

  const spotifyApi = new SpotifyWebApi({
    accessToken: spotifyToken!,
    clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET
  });

  React.useEffect(() => {
    if (location.pathname === SpotifyConstants.SPOTIFY_REDIRECT_PATHNAME) {
      const { access_token: accessToken } = Helpers.getTokenFromHash(location.hash);

      if (accessToken) {
        register(accessToken);
        navigate(AppRoutes.Home);
        window.location.reload();
      }
    }

    if (location.pathname === AppRoutes.Default) {
      navigate(AppRoutes.Home);
    }
  }, [location.pathname]);

  return <HomeRoutesClass spotifyApi={spotifyApi} isPlayerOpen={isOpen} />;
};

export default HomeRoutes;
