import * as React from "react";
import { Loader } from "./loader/loader-component";
import { useSpotifyAuth } from "../context/spotify-context";
import { useYoutubeAuth } from "../context/youtube-context";
import { useDeezerAuth } from "../context/deezer-context";
import { useAppContext } from "../context/app-context";

const Authenticated = React.lazy(() => import("./routes/home-routes"));
const UnAuthenticated = React.lazy(() => import("./routes/dashboard-routes"));

export default function Jamify(): JSX.Element {
  const { spotifyToken } = useSpotifyAuth();
  const { youtubeToken } = useYoutubeAuth();
  const { deezerToken } = useDeezerAuth();
  const { isOnline } = useAppContext();

  const isAuthenticated = isOnline && (Boolean(spotifyToken) || Boolean(youtubeToken) || Boolean(deezerToken));

  return (
    <React.Suspense fallback={<Loader />}>{isAuthenticated ? <Authenticated /> : <UnAuthenticated />}</React.Suspense>
  );
}
