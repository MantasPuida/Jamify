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

interface Props {
  spotifyApi: SpotifyWebApi;
}

function HomeRoutesClass(props: Props) {
  const { spotifyApi } = props;

  return (
    <Routes>
      <Route path={AppRoutes.Home} element={<Home spotifyApi={spotifyApi} />} />
      <Route path={AppRoutes.Explore} element={<Explore />} />
      <Route path={AppRoutes.Search} element={<Search />} />
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}

// eslint-disable-next-line react/function-component-definition
const HomeRoutes = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { spotifyToken } = useSpotifyAuth();

  const spotifyApi = new SpotifyWebApi({
    accessToken: spotifyToken!
  });

  React.useEffect(() => {
    if (location.pathname === SpotifyConstants.SPOTIFY_REDIRECT_PATHNAME || location.pathname === AppRoutes.Default) {
      navigate(AppRoutes.Home);
    }
  }, [location.pathname]);

  return <HomeRoutesClass spotifyApi={spotifyApi} />;
};

export default HomeRoutes;
