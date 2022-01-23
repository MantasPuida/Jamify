import * as React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../context/spotify-context";
import { getHash } from "../../utils/helpers";
import { NotFound } from "../errors/not-found-component";
import { Dashboard } from "../dashboard/dashboard-component";

interface InnerProps {
  error: boolean;
}

// eslint-disable-next-line react/function-component-definition
function DashboardRoutesClass(props: InnerProps) {
  const { error } = props;

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard error={error} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// eslint-disable-next-line react/function-component-definition
const DashboardRoutes = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (location.pathname === "/") {
      navigate("/dashboard");
    } else if (location.search) {
      navigate("/dashboard");
      setError(true);
    }

    if (location.pathname === "/callback") {
      const { access_token: accessToken } = getHash(location.hash);

      if (accessToken) {
        register(accessToken);
      }
    }
  }, [location.pathname]);

  return <DashboardRoutesClass error={error} />;
};

export default DashboardRoutes;
