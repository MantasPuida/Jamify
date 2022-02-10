export namespace DeezerConstants {
  export const scopes: string[] = [
    "basic_access",
    "email",
    "offline_access",
    "manage_library",
    "manage_community",
    "delete_library",
    "listening_history"
  ];

  export const DEEZER_REDIRECT_URI = "http://localhost:3000/auth/deezer/callback";
}
