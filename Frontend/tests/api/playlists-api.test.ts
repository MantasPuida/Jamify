import { PlaylistApi } from "../../src/api/api-endpoints";

describe("Playlists API endpoints", () => {
  jest.setTimeout(10000);

  let Start: number;

  beforeAll(() => {
    Start = Date.now();
  });

  afterAll(() => {
    console.log(`Test took ${Date.now() - Start}ms`);
  });

  const { UserApiEndpoints, PlaylistApiEndpoints } = PlaylistApi;
  let userId: string | undefined = undefined;
  let playlistId: string | undefined = undefined;

  function checkResponseObjectProperties(responseData: any) {
    expect(responseData).toHaveProperty("playlistId");
    expect(responseData).toHaveProperty("playlistName");
    expect(responseData).toHaveProperty("playlistDescription");
    expect(responseData).toHaveProperty("playlistImage");
  }

  afterAll(async () => {
    await UserApiEndpoints().deleteUser(userId);
  });

  beforeAll(async () => {
    await UserApiEndpoints()
      .postUser({
        DeezerUniqueIdentifier: "123",
        DeezerEmail: "deezer@gmail.com",
        DeezerName: "test",
        SpotifyUniqueIdentifier: "123",
        SpotifyEmail: "spotify@gmail.com",
        SpotifyName: "test",
        YoutubeUniqueIdentifier: "123",
        YoutubeEmail: "youtube@gmail.com",
        YoutubeName: "test"
      })
      .then((response) => {
        userId = response.data.userId;
      });
  });

  it("Post playlist", async () => {
    await PlaylistApiEndpoints()
      .postPlaylist(userId, {
        PlaylistDescription: "test",
        PlaylistName: "test",
        PlaylistImage: "test"
      })
      .then((playlists) => {
        const responseData = playlists.data;

        expect(playlists.status).toBe(201);
        expect(responseData).toBeInstanceOf(Object);
        checkResponseObjectProperties(responseData);

        expect(responseData.playlistId).toBeDefined();
        expect(responseData.playlistName).toBe("test");
        expect(responseData.playlistDescription).toBe("test");
        expect(responseData.playlistImage).toBe("test");

        playlistId = responseData.playlistId;
      });
  });

  it("Fetch playlists", async () => {
    await PlaylistApiEndpoints()
      .fetchPlaylists(userId)
      .then((playlists) => {
        const responseData = playlists.data;

        expect(playlists.status).toBe(200);
        expect(responseData).toBeInstanceOf(Array);
        expect(responseData.length).toBeGreaterThan(0);

        checkResponseObjectProperties(responseData[0]);
      });
  });

  it("Fetch playlist", async () => {
    await PlaylistApiEndpoints()
      .fetchPlaylist(userId, playlistId)
      .then((playlist) => {
        const responseData = playlist.data;

        expect(playlist.status).toBe(200);
        expect(responseData).toBeInstanceOf(Object);
        checkResponseObjectProperties(responseData);

        expect(responseData.playlistId).toBe(playlistId);
        expect(responseData.playlistName).toBe("test");
        expect(responseData.playlistDescription).toBe("test");
        expect(responseData.playlistImage).toBe("test");
      });
  });

  it("Update playlist", async () => {
    await PlaylistApiEndpoints()
      .putPlaylist(userId, playlistId, {
        PlaylistDescription: "testUpdated",
        PlaylistName: "testUpdated",
        PlaylistImage: "testUpdated"
      })
      .then((playlist) => {
        const responseData = playlist.data;

        expect(playlist.status).toBe(200);
        expect(responseData).toBeInstanceOf(Object);
        checkResponseObjectProperties(responseData);

        expect(responseData.playlistId).toBe(playlistId);
        expect(responseData.playlistName).toBe("testUpdated");
        expect(responseData.playlistDescription).toBe("testUpdated");
        expect(responseData.playlistImage).toBe("testUpdated");
      });
  });

  it("Delete playlist", async () => {
    if (userId) {
      await PlaylistApiEndpoints()
        .deletePlaylist(userId, playlistId)
        .then((response) => {
          expect(response.status).toBe(204);
        });
    }

    await PlaylistApiEndpoints()
      .fetchPlaylist(userId, playlistId)
      .then((response) => {
        expect(response.status).toBe(404);
      })
      .catch((error) => {
        expect(error.response.status).toBe(404);
      });
  });
});
