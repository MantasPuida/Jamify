import { PlaylistApi } from "../../src/api/api-endpoints";

interface User {
  userId: string;
  spotifyUniqueIdentifier: string;
  youtubeUniqueIdentifier: string;
  deezerUniqueIdentifier: string;
  spotifyName: string;
  youtubeName: string;
  deezerName: string;
  spotifyEmail: string;
  youtubeEmail: string;
  deezerEmail: string;
}

describe("Local API Tests", () => {
  const { UserApiEndpoints } = PlaylistApi;
  let userId: string | undefined = undefined;

  function checkResponseObjectProperties(responseData: any) {
    expect(responseData).toHaveProperty("userId");
    expect(responseData).toHaveProperty("spotifyUniqueIdentifier");
    expect(responseData).toHaveProperty("youtubeUniqueIdentifier");
    expect(responseData).toHaveProperty("deezerUniqueIdentifier");
    expect(responseData).toHaveProperty("spotifyName");
    expect(responseData).toHaveProperty("youtubeName");
    expect(responseData).toHaveProperty("deezerName");
    expect(responseData).toHaveProperty("spotifyEmail");
    expect(responseData).toHaveProperty("youtubeEmail");
    expect(responseData).toHaveProperty("deezerEmail");
  }

  it("Fetch users", async () => {
    await UserApiEndpoints()
      .fetchUsers()
      .then((users) => {
        const responseData = users.data[0];

        expect(users.status).toBe(200);
        expect(users.data).toBeInstanceOf(Array);
        expect(responseData).toBeInstanceOf(Object);
        expect(users.data.length).toBeGreaterThan(0);

        checkResponseObjectProperties(responseData);
      });
  });

  it("Post user and check response", async () => {
    await UserApiEndpoints()
      .postUser({
        DeezerUniqueIdentifier: "123",
        DeezerEmail: "test@gmail.com",
        DeezerName: "test",
        SpotifyUniqueIdentifier: "123",
        SpotifyEmail: "test@gmail.com",
        SpotifyName: "test",
        YoutubeUniqueIdentifier: "123",
        YoutubeEmail: "test@gmail.com",
        YoutubeName: "test"
      })
      .then((response) => {
        const responseData = response.data;

        expect(response.status).toBe(201);
        checkResponseObjectProperties(responseData);

        expect(responseData.spotifyUniqueIdentifier).toBe("123");
        expect(responseData.youtubeUniqueIdentifier).toBe("123");
        expect(responseData.deezerUniqueIdentifier).toBe("123");
        expect(responseData.spotifyName).toBe("test");
        expect(responseData.youtubeName).toBe("test");
        expect(responseData.deezerName).toBe("test");
        expect(responseData.spotifyEmail).toBe("test@gmail.com");
        expect(responseData.youtubeEmail).toBe("test@gmail.com");
        expect(responseData.deezerEmail).toBe("test@gmail.com");

        expect(responseData.userId).toBeDefined();

        userId = responseData.userId;
      });
  });

  it("Get user by id", async () => {
    if (userId) {
      await UserApiEndpoints()
        .fetchUser(userId)
        .then((response) => {
          const responseData = response.data;

          expect(response.status).toBe(200);

          expect(responseData.spotifyUniqueIdentifier).toBe("123");
          expect(responseData.youtubeUniqueIdentifier).toBe("123");
          expect(responseData.deezerUniqueIdentifier).toBe("123");
          expect(responseData.spotifyName).toBe("test");
          expect(responseData.youtubeName).toBe("test");
          expect(responseData.deezerName).toBe("test");

          expect(responseData.userId).toBeDefined();
        });
    }
  });

  it("Put user and check response", async () => {
    if (userId) {
      await UserApiEndpoints()
        .putUser(
          {
            DeezerUniqueIdentifier: "1234",
            DeezerEmail: "test2@gmail.com",
            DeezerName: "test2",
            SpotifyUniqueIdentifier: "1234",
            SpotifyEmail: "test2@gmail.com",
            SpotifyName: "test2",
            YoutubeUniqueIdentifier: "1234",
            YoutubeEmail: "test2@gmail.com",
            YoutubeName: "test2"
          },
          userId
        )
        .then((response) => {
          const responseData = response.data;

          expect(response.status).toBe(200);
          checkResponseObjectProperties(responseData);

          expect(responseData.spotifyUniqueIdentifier).toBe("1234");
          expect(responseData.youtubeUniqueIdentifier).toBe("1234");
          expect(responseData.deezerUniqueIdentifier).toBe("1234");
          expect(responseData.spotifyName).toBe("test2");
          expect(responseData.youtubeName).toBe("test2");
          expect(responseData.deezerName).toBe("test2");
          expect(responseData.spotifyEmail).toBe("test2@gmail.com");
          expect(responseData.youtubeEmail).toBe("test2@gmail.com");
          expect(responseData.deezerEmail).toBe("test2@gmail.com");
        });
    }
  });

  it("Delete user and check response", async () => {
    if (userId) {
      await UserApiEndpoints()
        .deleteUser(userId)
        .then((response) => {
          expect(response.status).toBe(204);
        });
    }

    await UserApiEndpoints()
      .fetchUser(userId)
      .then((users) => {
        expect(users.status).toBe(404);
      })
      .catch((error) => {
        expect(error.response.status).toBe(404);
      });
  });
});
