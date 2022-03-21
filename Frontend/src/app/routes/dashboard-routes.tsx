import * as React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import SpotifyWebApi from "spotify-web-api-node";
import { useSpotifyAuth } from "../../context/spotify-context";
import { Helpers } from "../../utils/helpers";
import { NotFound } from "../errors/not-found-component";
import { Dashboard } from "../dashboard/dashboard-component";
import { AppRoutes } from "./routes";
import { SpotifyConstants } from "../../constants/constants-spotify";
import { handleOnLogin } from "../../helpers/api-login";

interface InnerProps {
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
}

function DashboardRoutesClass(props: InnerProps) {
  const { error, setError } = props;

  return (
    <Routes>
      <Route path={AppRoutes.Dashboard} element={<Dashboard error={error} setError={setError} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// eslint-disable-next-line react/function-component-definition
const DashboardRoutes = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register: registerSpotifyToken } = useSpotifyAuth();
  const [error, setError] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (location.pathname === AppRoutes.Default) {
      navigate(AppRoutes.Dashboard);
    }

    if (location.search.includes("error")) {
      navigate(AppRoutes.Dashboard);
      setError(true);
    }

    if (location.pathname === SpotifyConstants.SPOTIFY_REDIRECT_PATHNAME) {
      const { access_token: accessToken } = Helpers.getTokenFromHash(location.hash);

      const spotifyApi = new SpotifyWebApi({
        accessToken,
        clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
        clientSecret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET
      });

      spotifyApi.getMe().then((me) => {
        handleOnLogin({
          DeezerUniqueIdentifier: "",
          SpotifyUniqueIdentifier: me.body.id,
          YoutubeUniqueIdentifier: ""
        });
      });

      if (accessToken) {
        registerSpotifyToken(accessToken);
      }
    }
  }, [location.pathname]);

  return <DashboardRoutesClass error={error} setError={setError} />;
};

export default DashboardRoutes;
