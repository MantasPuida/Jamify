import * as React from "react";
import { Loader } from "./loader/loader-component";
import { useSpotifyAuth } from "../context/spotify-context";
import { useYoutubeAuth } from "../context/youtube-context";

const Authenticated = React.lazy(() => import("./routes/home-routes"));
const UnAuthenticated = React.lazy(() => import("./routes/dashboard-routes"));

// eslint-disable-next-line react/function-component-definition
export default function Jamify(): JSX.Element {
  const { spotifyToken } = useSpotifyAuth();
  const { youtubeToken } = useYoutubeAuth();

  const isAuthenticated = Boolean(spotifyToken) || Boolean(youtubeToken);

  return (
    <React.Suspense fallback={<Loader />}>{isAuthenticated ? <Authenticated /> : <UnAuthenticated />}</React.Suspense>
  );
}
