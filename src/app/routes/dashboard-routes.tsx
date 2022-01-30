import * as React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { useSpotifyAuth } from "../../context/spotify-context";
import { getHash } from "../../utils/helpers";
import { NotFound } from "../errors/not-found-component";
import { Dashboard } from "../dashboard/dashboard-component";
import { AppRoutes } from "./routes";
import { SpotifyCallback } from "../../constants/constants-spotify";

interface InnerProps {
  error: boolean;
}

function DashboardRoutesClass(props: InnerProps) {
  const { error } = props;

  return (
    <Routes>
      <Route path={AppRoutes.Dashboard} element={<Dashboard error={error} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// eslint-disable-next-line react/function-component-definition
const DashboardRoutes = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useSpotifyAuth();
  const [error, setError] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (location.pathname === "/") {
      navigate(AppRoutes.Dashboard);
    } else if (location.search) {
      navigate(AppRoutes.Dashboard);
      setError(true);
    }

    if (location.pathname === SpotifyCallback) {
      const { access_token: accessToken } = getHash(location.hash);

      if (accessToken) {
        register(accessToken);
      }
    }
  }, [location.pathname]);

  return <DashboardRoutesClass error={error} />;
};

export default DashboardRoutes;
