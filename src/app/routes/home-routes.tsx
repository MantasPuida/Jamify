import * as React from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { NotFound } from "../errors/not-found-component";
import { Home } from "../Home/home-components";
import { AppRoutes } from "./routes";
import { useSpotifyAuth } from "../../context/spotify-context";

interface Props {
  spotifyApi: SpotifyWebApi;
}

// eslint-disable-next-line react/function-component-definition
function HomeRoutesClass(props: Props) {
  const { spotifyApi } = props;

  return (
    <Routes>
      <Route path={AppRoutes.Home} element={<Home spotifyApi={spotifyApi} />} />
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
    if (location.pathname === "/callback" || location.pathname === "/") {
      navigate(AppRoutes.Home);
    }
  }, [location.pathname]);

  return <HomeRoutesClass spotifyApi={spotifyApi} />;
};

export default HomeRoutes;
