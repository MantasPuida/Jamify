export interface ChartResponse {
  albums: Albums;
  artists: Artists;
  playlists: Playlists;
  podcasts: Podcasts;
  tracks: Tracks;
}

export interface Tracks {
  data: Track[];
  total: number;
}

export interface Track {
  album: Album;
  artist: Artist;
  duration: number;
  explicit_content_cover: number;
  explicit_content_lyrics: number;
  explicit_lyrics: boolean;
  id: number;
  link: string;
  md5_image: string;
  position: number;
  preview: string;
  rank: number;
  title: string;
  title_short: string;
  title_version: string;
  type: string;
}

export interface Podcasts {
  data: Podcast[];
  total: number;
}

export interface Podcast {
  available: boolean;
  description: string;
  fans: number;
  id: number;
  link: string;
  picture: string;
  picture_big: string;
  picture_medium: string;
  picture_small: string;
  picture_xl: string;
  share: string;
  title: string;
  type: string;
}

export interface Playlists {
  data: Playlist[];
  total: number;
}

export interface Playlist {
  checksum: string;
  creation_date: string;
  id: number;
  link: string;
  md5_image: string;
  nb_tracks: number;
  picture: string;
  picture_big: string;
  picture_medium: string;
  picture_small: string;
  picture_type: string;
  picture_xl: string;
  public: true;
  title: string;
  tracklist: string;
  type: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  tracklist: string;
  type: string;
}

export interface Artists {
  data: Artist[];
  total: number;
}

export interface Albums {
  data: Album[];
  total: number;
}

export interface Album {
  artist: Artist;
  cover: string;
  cover_big: string;
  cover_medium: string;
  cover_small: string;
  cover_xl: string;
  explicit_lyrics: boolean;
  id: number;
  link: string;
  position: number;
  record_type: string;
  title: string;
  tracklist: string;
  type: string;
}

export interface Artist {
  id: number;
  link: string;
  name: string;
  picture: string;
  picture_big: string;
  picture_medium: string;
  picture_small: string;
  picture_xl: string;
  radio: boolean;
  tracklist: string;
  type: string;
}

export interface ArtistResponse extends Artist {
  nb_album: number;
  nb_fan: number;
  share: string;
}

export interface TrackListResponse {
  data: TrackListData[];
  total: number;
}

export interface TrackListData extends Track {
  contributors: Artist[];
}

export interface PlaylistsResponseMe {
  data: PlaylistsResponse[];
  total: number;
}

export interface PlaylistsResponse {
  checksum: string;
  collaborative: boolean;
  creation_date: Date;
  creator: User;
  duration: number;
  fans: number;
  id: number;
  is_loved_track: boolean;
  link: string;
  md5_image: string;
  nb_tracks: number;
  picture: string;
  picture_big: string;
  picture_medium: string;
  picture_small: string;
  picture_type: string;
  picture_xl: string;
  public: boolean;
  time_add: number;
  time_mod: number;
  title: string;
  tracklist: string;
  type: string;
}

export interface ArtistAlbumsResponse {
  data: ArtistAlbumsData[];
  total: number;
}

export interface ArtistAlbumsData {
  artist: User;
  disk_number: number;
  duration: number;
  explicit_content_cover: number;
  explicit_content_lyrics: number;
  explicit_lyrics: boolean;
  id: number;
  isrc: string;
  link: string;
  md5_image: string;
  preview: string;
  rank: number;
  readable: boolean;
  title: string;
  title_short: string;
  title_version: string;
  track_position: number;
  type: string;
}
