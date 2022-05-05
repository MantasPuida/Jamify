import { PlaylistApi } from "../../src/api/api-endpoints";

describe("Tracks API endpoints", () => {
  jest.setTimeout(10000);

  let Start: number;

  beforeAll(() => {
    Start = Date.now();
  });

  afterAll(() => {
    console.log(`Test took ${Date.now() - Start}ms`);
  });

  const { UserApiEndpoints, PlaylistApiEndpoints, TracksApiEndpoints } = PlaylistApi;
  let userId: string | undefined = undefined;
  let playlistId: string | undefined = undefined;
  let trackId: string | undefined = undefined;

  function checkResponseObjectProperties(responseData: any) {
    expect(responseData).toHaveProperty("trackId");
    expect(responseData).toHaveProperty("trackName");
    expect(responseData).toHaveProperty("imageUrl");
    expect(responseData).toHaveProperty("artists");
    expect(responseData).toHaveProperty("duration");
    expect(responseData).toHaveProperty("album");
  }

  afterAll(async () => {
    await PlaylistApiEndpoints().deletePlaylist(userId, playlistId);
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

    await PlaylistApiEndpoints()
      .postPlaylist(userId, {
        PlaylistDescription: "test",
        PlaylistName: "test",
        PlaylistImage: "test"
      })
      .then((playlists) => {
        const responseData = playlists.data;

        playlistId = responseData.playlistId;
      });
  });

  it("Post track", async () => {
    await TracksApiEndpoints()
      .postTrack(userId, playlistId, {
        Album: "album",
        Artists: "artist",
        Duration: "duration",
        ImageUrl: "imageUrl",
        TrackName: "trackName"
      })
      .then((response) => {
        const responseData = response.data;

        expect(response.status).toBe(201);
        expect(responseData).toBeInstanceOf(Object);
        checkResponseObjectProperties(responseData);

        expect(responseData.trackId).toBeDefined();
        expect(responseData.trackName).toBe("trackName");
        expect(responseData.imageUrl).toBe("imageUrl");
        expect(responseData.duration).toBe("duration");
        expect(responseData.album).toBe("album");
        expect(responseData.artists).toBe("artist");

        trackId = responseData.trackId;
      });
  });

  it("Fetch tracks", async () => {
    await TracksApiEndpoints()
      .fetchTracks(userId, playlistId)
      .then((response) => {
        const responseData = response.data;

        expect(response.status).toBe(200);
        expect(responseData).toBeInstanceOf(Array);
        expect(responseData.length).toBeGreaterThan(0);

        checkResponseObjectProperties(responseData[0]);
      });
  });

  it("Fetch track", async () => {
    await TracksApiEndpoints()
      .fetchTrack(userId, playlistId, trackId)
      .then((response) => {
        const responseData = response.data;

        expect(response.status).toBe(200);
        expect(responseData).toBeInstanceOf(Object);
        checkResponseObjectProperties(responseData);

        expect(responseData.trackId).toBeDefined();
        expect(responseData.trackName).toBe("trackName");
        expect(responseData.imageUrl).toBe("imageUrl");
        expect(responseData.duration).toBe("duration");
        expect(responseData.album).toBe("album");
        expect(responseData.artists).toBe("artist");
      });
  });

  it("Delete track", async () => {
    await TracksApiEndpoints()
      .deleteTrack(userId, playlistId, trackId)
      .then((response) => {
        expect(response.status).toBe(204);
      });

    await TracksApiEndpoints()
      .fetchTrack(userId, playlistId, trackId)
      .then((response) => {
        expect(response.status).toBe(404);
      })
      .catch((error) => {
        expect(error.response.status).toBe(404);
      });
  });
});
