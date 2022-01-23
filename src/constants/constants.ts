const CLIENT_ID = "968f612bca944f4292a0d19a5bbf049c";

const PERMISSION_SCOPE =
  "ugc-image-upload user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-private user-read-email user-follow-modify user-follow-read user-library-modify user-library-read streaming app-remote-control user-read-playback-position user-top-read user-read-recently-played playlist-modify-private playlist-read-collaborative playlist-read-private playlist-modify-public";

const REDIRECT_URL = "http://localhost:3000/callback";

export const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${PERMISSION_SCOPE}&response_type=token&show_dialog={true}`;
