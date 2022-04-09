import axios from "axios";

export namespace PlaylistApi {
  const BaseUrl = "http://localhost:5151/api";
  const UsersBaseUrl = `${BaseUrl}/users`;

  export interface UserData {
    DeezerUniqueIdentifier: string;
    SpotifyUniqueIdentifier: string;
    YoutubeUniqueIdentifier: string;
    SpotifyName: string;
    YoutubeName: string;
    DeezerName: string;
    SpotifyEmail: string;
    YoutubeEmail: string;
    DeezerEmail: string;
  }

  interface PlaylistData {
    PlaylistName: string;
    PlaylistImage: string;
    PlaylistDescription: string;
  }

  interface TrackData {
    TrackName: string;
    ImageUrl: string;
    Artists: string;
    Duration: string;
    Album: string;
  }

  export const UserApiEndpoints = () => ({
    fetchUsers: () => axios.get(UsersBaseUrl),
    fetchUser: (id: string) => axios.get(`${UsersBaseUrl}/${id}`),
    postUser: (data: UserData) => axios.post(UsersBaseUrl, data),
    putUser: (data: UserData, id: string) => axios.put(`${UsersBaseUrl}/${id}`, data),
    deleteUser: (id: string) => axios.delete(`${UsersBaseUrl}/${id}`)
  });

  export const PlaylistApiEndpoints = () => ({
    fetchPlaylists: (userId: string) => axios.get(`${UsersBaseUrl}/${userId}/playlists`),
    fetchPlaylist: (userId: string, playlistId: string) =>
      axios.get(`${UsersBaseUrl}/${userId}/playlists/${playlistId}`),
    postPlaylist: (userId: string, data: PlaylistData) => axios.post(`${UsersBaseUrl}/${userId}/playlists`, data),
    putPlaylist: (userId: string, playlistId: string, data: PlaylistData) =>
      axios.post(`${UsersBaseUrl}/${userId}/playlists/${playlistId}`, data),
    deletePlaylist: (userId: string, playlistId: string) =>
      axios.delete(`${UsersBaseUrl}/${userId}/playlists/${playlistId}`)
  });

  export const TracksApiEndpoints = () => ({
    fetchTracks: (userId: string, playlistId: string) =>
      axios.get(`${UsersBaseUrl}/${userId}/playlists/${playlistId}/tracks`),
    fetchTrack: (userId: string, playlistId: string, trackId: string) =>
      axios.get(`${UsersBaseUrl}/${userId}/playlists/${playlistId}/tracks/${trackId}`),
    postTrack: (userId: string, playlistId: string, data: TrackData) =>
      axios.post(`${UsersBaseUrl}/${userId}/playlists/${playlistId}/tracks`, data),
    deleteTrack: (userId: string, playlistId: string, trackId: string) =>
      axios.delete(`${UsersBaseUrl}/${userId}/playlists/${playlistId}/tracks/${trackId}`)
  });
}
