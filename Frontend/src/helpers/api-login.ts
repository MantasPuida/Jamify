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
        putUser(
          {
            DeezerUniqueIdentifier: user[0].deezerUniqueIdentifier ?? dzId,
            SpotifyUniqueIdentifier: user[0].spotifyUniqueIdentifier ?? spId,
            YoutubeUniqueIdentifier: user[0].youtubeUniqueIdentifier ?? ytId
          },
          user[0].userId
        );
        setUserId(user[0].userId);
      }
    }
  });
}
