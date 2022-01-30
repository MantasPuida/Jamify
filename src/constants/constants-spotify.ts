const SPOTIFY_PERMISSION_SCOPE = [
  "ugc-image-upload",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-private",
  "user-read-email",
  "user-follow-modify",
  "user-follow-read",
  "user-library-modify",
  "user-library-read",
  "streaming",
  "app-remote-control",
  "user-read-playback-position",
  "user-top-read",
  "user-read-recently-played",
  "playlist-modify-private",
  "playlist-read-collaborative",
  "playlist-read-private",
  "playlist-modify-public"
];

const SPOTIFY_BASE_URL = "https://accounts.spotify.com/authorize";

export const SpotifyCallback = "http://localhost:3000/auth/spotify/callback";

export const SPOTIFY_AUTH_URL = `${SPOTIFY_BASE_URL}?client_id=${
  process.env.REACT_APP_SPOTIFY_CLIENT_ID
}&redirect_uri=${SpotifyCallback}&scope=${SPOTIFY_PERMISSION_SCOPE.join(" ")}&response_type=token&show_dialog=true`;
