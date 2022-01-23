import * as React from "react";
import { Loader } from "./loader/loader-component";
import { useAuth } from "../context/spotify-context";

const Authenticated = React.lazy(() => import("./routes/home-routes"));
const UnAuthenticated = React.lazy(() => import("./routes/dashboard-routes"));

// eslint-disable-next-line react/function-component-definition
export default function Jamify(): JSX.Element {
  const { token } = useAuth();

  return <React.Suspense fallback={<Loader />}>{token ? <Authenticated /> : <UnAuthenticated />}</React.Suspense>;
}