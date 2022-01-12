import * as React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Dashboard } from "../app/dashboard/dashboard-component";
import { NotFound } from "../app/errors/not-found-component";

class AppRoutesClass extends React.PureComponent {
  public render(): React.ReactNode {
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />;
      </Routes>
    );
  }
}

export const AppRoutes = React.memo(() => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [location.pathname]);

  return <AppRoutesClass />;
});
