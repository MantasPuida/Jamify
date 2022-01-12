const authEndpoint: string = "https://accounts.spotify.com/authorize";

const scopes = ["user-read-private"];

export const getAuthorizeHref = (): string => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;
  return `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
    "%20"
  )}&response_type=token`;
};
