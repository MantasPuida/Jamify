import * as React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { useSpotifyAuth } from "../../context/spotify-context";
import { Helpers } from "../../utils/helpers";
import { NotFound } from "../errors/not-found-component";
import { Dashboard } from "../dashboard/dashboard-component";
import { AppRoutes } from "./routes";
import { SpotifyConstants } from "../../constants/constants-spotify";
import { useAppContext } from "../../context/app-context";

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
  const { setIsOnline } = useAppContext();

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

      if (accessToken) {
        registerSpotifyToken(accessToken);
        navigate(AppRoutes.Home);
        setIsOnline(true);
      }
    }
  }, [location.pathname]);

  return <DashboardRoutesClass error={error} setError={setError} />;
};

export default DashboardRoutes;
