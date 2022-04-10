import * as React from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { NotFound } from "../errors/not-found-component";
import { Home } from "../Home/home-components";
import { AppRoutes } from "./routes";
import { MeComponent } from "../me/me-class";
import { useSpotifyAuth } from "../../context/spotify-context";
import { SpotifyConstants } from "../../constants/constants-spotify";
import { Search } from "../search/search-component";
import { Playlist } from "../spotify-playlist/playlist-class";
import { Helpers } from "../../utils/helpers";
import { HeaderComponent } from "../Home/header/header-component";
import { usePlayerContext } from "../../context/player-context";
import { Player } from "../player/player-component";
import { Artist } from "../artist/artist-component";
import { useAppContext } from "../../context/app-context";
import { BackdropLoader } from "../loader/loader-backdrop";
import { RelativeExploreRoutes } from "../explore/explore-relative-routes";
import { useYoutubeApiContext } from "../../context/youtube-api-context";
import { useYoutubeAuth } from "../../context/youtube-context";

interface Props {
  spotifyApi: SpotifyWebApi;
  isPlayerOpen: boolean;
  loading: boolean;
}

function HomeRoutesClass(props: Props) {
  const { spotifyApi, isPlayerOpen, loading } = props;

  const paddingStyle = isPlayerOpen ? 50 : 0;

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "black", overflowX: "hidden" }}>
      <HeaderComponent spotifyApi={spotifyApi} />
      {loading && <BackdropLoader />}
      <div style={{ paddingBottom: paddingStyle }}>
        <Routes>
          <Route path={AppRoutes.Home} element={<Home spotifyApi={spotifyApi} />} />
          <Route path={`${AppRoutes.Explore}/*`} element={<RelativeExploreRoutes spotifyApi={spotifyApi} />} />
          <Route path={AppRoutes.Me} element={<MeComponent spotifyApi={spotifyApi} />} />
          <Route path={AppRoutes.Search} element={<Search spotifyApi={spotifyApi} />} />
          <Route path={AppRoutes.Playlist} element={<Playlist spotifyApi={spotifyApi} />} />
          <Route path={AppRoutes.Artist} element={<Artist spotifyApi={spotifyApi} />} />
          <Route path="*" element={<NotFound />} />;
        </Routes>
      </div>
      {isPlayerOpen && <Player />}
    </div>
  );
}

// eslint-disable-next-line react/function-component-definition
const HomeRoutes = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen } = usePlayerContext();
  const { spotifyToken, register } = useSpotifyAuth();
  const { loading, setLoading, setIsOnline } = useAppContext();
  const { youtubeToken } = useYoutubeAuth();
  const { setMinePlaylist } = useYoutubeApiContext();

  React.useEffect(() => {
    setTimeout(() => {
      if (youtubeToken) {
        gapi.client.youtube.playlists
          .list({
            part: "snippet",
            mine: true,
            access_token: youtubeToken
          })
          .then((response) => {
            setMinePlaylist(response);
          });
      }
    }, 1000);
  }, [youtubeToken]);

  React.useEffect(() => {
    setLoading(true);
  }, [location.pathname]);

  React.useEffect(() => {
    if (location.pathname === SpotifyConstants.SPOTIFY_REDIRECT_PATHNAME) {
      const { access_token: accessToken } = Helpers.getTokenFromHash(location.hash);

      if (accessToken) {
        register(accessToken);
        navigate(AppRoutes.Home);
        setIsOnline(true);
      }
    }

    if (location.pathname === AppRoutes.Default) {
      navigate(AppRoutes.Home);
    }
  }, [location.pathname]);

  const spotifyApi = new SpotifyWebApi({
    accessToken: spotifyToken!,
    clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
    redirectUri: SpotifyConstants.SPOTIFY_CALLBACK
  });

  return <HomeRoutesClass spotifyApi={spotifyApi} loading={loading} isPlayerOpen={isOpen} />;
};

export default HomeRoutes;
