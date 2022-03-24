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
      const { DeezerUniqueIdentifier: dzId, SpotifyUniqueIdentifier: spId, YoutubeUniqueIdentifier: ytId } = userData;
      const user = data.filter(
        (item) =>
          item.youtubeUniqueIdentifier === ytId ||
          item.deezerUniqueIdentifier === dzId ||
          item.spotifyUniqueIdentifier === spId
      );

      if (user && user.length > 0) {
        const { deezerUniqueIdentifier, spotifyUniqueIdentifier, youtubeUniqueIdentifier, userId } = user[0];
        if (
          (spId && spId !== spotifyUniqueIdentifier) ||
          (dzId && dzId !== deezerUniqueIdentifier) ||
          (ytId && ytId !== youtubeUniqueIdentifier)
        ) {
          putUser(
            {
              DeezerUniqueIdentifier: deezerUniqueIdentifier.length > 1 ? deezerUniqueIdentifier : dzId,
              SpotifyUniqueIdentifier: spotifyUniqueIdentifier.length > 1 ? spotifyUniqueIdentifier : spId,
              YoutubeUniqueIdentifier: youtubeUniqueIdentifier.length > 1 ? youtubeUniqueIdentifier : ytId
            },
            userId
          );
          setUserId(userId);
        }
      }
    }
  });
}
