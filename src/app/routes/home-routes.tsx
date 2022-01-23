import * as React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { NotFound } from "../errors/not-found-component";
import { Home } from "../Home/home-components";

// eslint-disable-next-line react/function-component-definition
function AppRoutesClass() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}

// eslint-disable-next-line react/function-component-definition
const AppRoutes = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (location.pathname === "/callback" || location.pathname === "/") {
      navigate("/home");
    }
  }, [location.pathname]);

  return <AppRoutesClass />;
};

export default AppRoutes;
