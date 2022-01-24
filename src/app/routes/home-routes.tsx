import * as React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { NotFound } from "../errors/not-found-component";
import { Home } from "../Home/home-components";
import { AppRoutes } from "./routes";

// eslint-disable-next-line react/function-component-definition
function HomeRoutesClass() {
  return (
    <Routes>
      <Route path={AppRoutes.Home} element={<Home />} />
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}

// eslint-disable-next-line react/function-component-definition
const HomeRoutes = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (location.pathname === "/callback" || location.pathname === "/") {
      navigate(AppRoutes.Home);
    }
  }, [location.pathname]);

  return <HomeRoutesClass />;
};

export default HomeRoutes;
