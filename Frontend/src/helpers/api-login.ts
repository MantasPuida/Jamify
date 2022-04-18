import { PlaylistApi } from "../api/api-endpoints";
import { User } from "../types/User";

export function handleOnLogin(userData: PlaylistApi.UserData, setUserId: Function) {
  const { UserApiEndpoints } = PlaylistApi;
  const { fetchUsers, postUser, putUser } = UserApiEndpoints();

  fetchUsers().then((users) => {
    const data = users.data as User[];

    if (data.length === 0) {
      postUser(userData).then((response) => {
        const responseData = response.data as User;

        setUserId(responseData.userId);
      });
    } else {
      const {
        DeezerUniqueIdentifier: dzId,
        SpotifyUniqueIdentifier: spId,
        YoutubeUniqueIdentifier: ytId,
        DeezerEmail,
        DeezerName,
        SpotifyEmail,
        SpotifyName,
        YoutubeEmail,
        YoutubeName
      } = userData;

      const user = data.find(
        (item) =>
          item.youtubeUniqueIdentifier === ytId ||
          (item.deezerEmail === DeezerEmail && item.deezerName === DeezerName) ||
          item.deezerUniqueIdentifier === dzId ||
          (item.spotifyEmail === SpotifyEmail && item.spotifyName === SpotifyName) ||
          item.spotifyUniqueIdentifier === spId ||
          (item.youtubeEmail === YoutubeEmail && item.youtubeName === YoutubeName) ||
          item.youtubeEmail === item.deezerEmail ||
          item.youtubeEmail === item.spotifyEmail ||
          item.deezerEmail === item.spotifyEmail
      );

      if (user) {
        const {
          deezerUniqueIdentifier,
          spotifyUniqueIdentifier,
          youtubeUniqueIdentifier,
          userId,
          deezerEmail,
          deezerName,
          spotifyEmail,
          spotifyName,
          youtubeEmail,
          youtubeName
        } = user;

        setUserId(userId);

        if (
          (spId && spId !== spotifyUniqueIdentifier) ||
          (dzId && dzId !== deezerUniqueIdentifier) ||
          (ytId && ytId !== youtubeUniqueIdentifier) ||
          (DeezerEmail && DeezerEmail !== deezerEmail) ||
          (DeezerName && DeezerName !== deezerName) ||
          (SpotifyEmail && SpotifyEmail !== spotifyEmail) ||
          (SpotifyName && SpotifyName !== spotifyName) ||
          (YoutubeEmail && YoutubeEmail !== youtubeEmail) ||
          (YoutubeName && YoutubeName !== youtubeName)
        ) {
          putUser(
            {
              DeezerUniqueIdentifier: deezerUniqueIdentifier.length > 1 ? deezerUniqueIdentifier : dzId,
              SpotifyUniqueIdentifier: spotifyUniqueIdentifier.length > 1 ? spotifyUniqueIdentifier : spId,
              YoutubeUniqueIdentifier: youtubeUniqueIdentifier.length > 1 ? youtubeUniqueIdentifier : ytId,
              DeezerEmail: deezerEmail.length > 1 ? deezerEmail : DeezerEmail,
              DeezerName: deezerName.length > 1 ? deezerName : DeezerName,
              SpotifyEmail: spotifyEmail.length > 1 ? spotifyEmail : SpotifyEmail,
              SpotifyName: spotifyName.length > 1 ? spotifyName : SpotifyName,
              YoutubeEmail: youtubeEmail.length > 1 ? youtubeEmail : YoutubeEmail,
              YoutubeName: youtubeName.length > 1 ? youtubeName : YoutubeName
            },
            userId
          );
        }
      } else {
        postUser(userData).then((response) => {
          const responseData = response.data as User;

          setUserId(responseData.userId);
        });
      }
    }
  });
}
