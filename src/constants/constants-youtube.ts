export namespace YoutubeConstants {
  // TODO: Define only necessary scopes
  export const YOUTUBE_SCOPES: string[] = [
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.channel-memberships.creator",
    "https://www.googleapis.com/auth/youtube.force-ssl",
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtubepartner",
    "https://www.googleapis.com/auth/youtubepartner-channel-audit"
  ];

  export const discoveryUrl = "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest";

  export const YoutubeCallback = "http://localhost:3000/auth/youtube/callback";
}
