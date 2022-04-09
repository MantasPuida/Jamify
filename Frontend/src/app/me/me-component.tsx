import * as React from "react";
import Spotify from "mdi-material-ui/Spotify";
import PlayCircleOutline from "mdi-material-ui/PlayCircleOutline";
import { Grid, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import SpotifyWebApi from "spotify-web-api-node";
import { HomeLandingPageStyles, useHomeLandingPageStyles } from "../Home/landing-page.styles";
// eslint-disable-next-line import/no-cycle
import { PlaylistCard } from "./playlist-component";
import { useUserContext } from "../../context/user-context";
import { PlaylistApi } from "../../api/api-endpoints";
import { useDeezerAuth } from "../../context/deezer-context";
import { PlaylistsResponseMe } from "../../types/deezer.types";

import "swiper/css";
import "swiper/css/navigation";
import "./styles.css";
import { useAppContext } from "../../context/app-context";

type PlaylistSourceType = "Spotify" | "Youtube" | "Deezer" | "Own";

export interface PlaylistType {
  playlistId: string;
  playlistName: string;
  playlistImage: string;
  playlistDescription: string;
}

interface InnerProps extends WithStyles<typeof HomeLandingPageStyles> {
  userId?: string;
  deezerToken: string | null;
  setLoading: Function;
}

interface OuterProps {
  spotifyApi: SpotifyWebApi;
  playlistSource: PlaylistSourceType;
  shouldCancelLoader: boolean;
}

type Props = InnerProps & OuterProps;

interface State {
  spotifyPlaylists?: SpotifyApi.ListOfUsersPlaylistsResponse;
  youtubePlaylists?: gapi.client.youtube.PlaylistListResponse;
  deezerPlaylists?: PlaylistsResponseMe;
  ownPlaylist?: PlaylistType[];
  attempts: number;
}

class MePlaylistClass extends React.PureComponent<Props, State> {
  public state: State;

  private readonly maxAttempts: number = 20;

  constructor(props: Props) {
    super(props);

    this.state = { attempts: 0 };

    const { spotifyApi, playlistSource, userId } = props;

    if (playlistSource === "Spotify") {
      spotifyApi.getUserPlaylists().then((playlists) => {
        this.setState({ spotifyPlaylists: playlists.body });
      });
    } else if (playlistSource === "Youtube") {
      this.fetchYoutubeTracks();
    } else if (playlistSource === "Own") {
      if (!userId) {
        return;
      }

      this.fetchOwnTracks(userId);
    } else if (playlistSource === "Deezer") {
      this.fetchDeezerTracks();
    }
  }

  private fetchDeezerTracks = () => {
    const { deezerToken } = this.props;
    DZ.api(`user/me/playlists?access_token=${deezerToken}`, (response) => {
      this.setState({ deezerPlaylists: response });
    });
  };

  private fetchOwnTracks = (userId: string): void => {
    const { PlaylistApiEndpoints } = PlaylistApi;
    PlaylistApiEndpoints()
      .fetchPlaylists(userId)
      // eslint-disable-next-line consistent-return
      .then((value) => {
        this.setState({ ownPlaylist: value.data as PlaylistType[] });
      });
  };

  private fetchYoutubeTracks = (): void => {
    const { attempts } = this.state;

    if (attempts >= this.maxAttempts) {
      this.setState({ attempts: this.maxAttempts });
      return;
    }

    if (!gapi.client || !gapi.client.youtube || !gapi.client.youtube.playlistItems) {
      setTimeout(() => {
        this.setState((state) => ({ attempts: state.attempts + 1 }));
        this.fetchYoutubeTracks();
      }, 100);
    } else {
      setTimeout(() => {
        gapi.client.youtube.playlists.list({ part: "snippet", mine: true, maxResults: 99 }).then((playlists) => {
          this.setState({ youtubePlaylists: playlists.result });
        });
      }, 50);
    }
  };

  public render(): React.ReactNode {
    const { classes, playlistSource, spotifyApi, shouldCancelLoader } = this.props;
    const { spotifyPlaylists, youtubePlaylists, ownPlaylist, deezerPlaylists } = this.state;

    if (
      (playlistSource === "Spotify" && !spotifyPlaylists) ||
      (playlistSource === "Youtube" && !youtubePlaylists) ||
      (playlistSource === "Own" && !ownPlaylist) ||
      (playlistSource === "Deezer" && !deezerPlaylists)
    ) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }

    return (
      <Grid container={true}>
        <Grid item={true} xs={12} className={classes.homeGrid}>
          <Grid style={{ backgroundColor: "black", padding: "32px 0 24px 0", margin: "0 150px" }}>
            <Grid container={true} item={true} xs={12}>
              {playlistSource === "Spotify" && (
                <Grid item={true} xs={12}>
                  <Typography fontSize={45} fontWeight={900} fontFamily="Poppins,sans-serif" color="white">
                    My Playlists
                  </Typography>
                </Grid>
              )}
              <Grid item={true}>
                <Typography
                  fontSize={25}
                  fontWeight={400}
                  fontFamily="Poppins,sans-serif"
                  color="white"
                  style={{ float: "left" }}>
                  {playlistSource} Playlists
                </Typography>
              </Grid>
              <Grid item={true} style={{ paddingLeft: 8, marginTop: 6 }}>
                {playlistSource === "Spotify" && <Spotify style={{ color: "#1DB954" }} />}
                {playlistSource === "Youtube" && <PlayCircleOutline style={{ color: "#FF0000" }} />}
              </Grid>
            </Grid>
            <Grid item={true} xs={12}>
              <Swiper
                slidesPerView={6}
                className="mySwiper"
                centeredSlides={false}
                navigation={true}
                modules={[Navigation]}
                style={{ width: "100%", marginLeft: 4, textAlignLast: "start" }}>
                {playlistSource === "Spotify" &&
                  spotifyPlaylists?.items.map((playlist) => (
                    <SwiperSlide style={{ backgroundColor: "black" }} key={playlist.id}>
                      <PlaylistCard
                        shouldCancelLoader={shouldCancelLoader}
                        spotifyApi={spotifyApi}
                        spotifyPlaylist={playlist}
                        key={playlist.id}
                      />
                    </SwiperSlide>
                  ))}
                {playlistSource === "Youtube" &&
                  youtubePlaylists?.items?.map((playlist) => {
                    if (!playlist.id) {
                      // eslint-disable-next-line react/jsx-no-useless-fragment
                      const randomKey = Math.random() * 50;
                      return <React.Fragment key={randomKey} />;
                    }

                    return (
                      <SwiperSlide style={{ backgroundColor: "black" }} key={playlist.id}>
                        <PlaylistCard
                          shouldCancelLoader={shouldCancelLoader}
                          spotifyApi={spotifyApi}
                          youtubePlaylist={playlist}
                          key={playlist.id}
                        />
                        ;
                      </SwiperSlide>
                    );
                  })}
                {playlistSource === "Own" &&
                  ownPlaylist?.map((playlist) => {
                    if (!playlist.playlistId) {
                      // eslint-disable-next-line react/jsx-no-useless-fragment
                      const randomKey = Math.random() * 50;
                      return <React.Fragment key={randomKey} />;
                    }

                    return (
                      <SwiperSlide style={{ backgroundColor: "black" }} key={playlist.playlistId}>
                        <PlaylistCard
                          shouldCancelLoader={shouldCancelLoader}
                          spotifyApi={spotifyApi}
                          ownPlaylist={playlist}
                          key={playlist.playlistId}
                        />
                        ;
                      </SwiperSlide>
                    );
                  })}
                {playlistSource === "Deezer" &&
                  deezerPlaylists?.data.map((playlist) => {
                    if (!playlist.id) {
                      // eslint-disable-next-line react/jsx-no-useless-fragment
                      const randomKey = Math.random() * 50;
                      return <React.Fragment key={randomKey} />;
                    }

                    return (
                      <SwiperSlide style={{ backgroundColor: "black" }} key={playlist.id}>
                        <PlaylistCard
                          shouldCancelLoader={shouldCancelLoader}
                          spotifyApi={spotifyApi}
                          deezerPlaylist={playlist}
                          key={playlist.id}
                        />
                        ;
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const MePlaylist = React.memo<OuterProps>((props) => {
  const { userId } = useUserContext();
  const { deezerToken } = useDeezerAuth();
  const classes = useHomeLandingPageStyles();
  const { setLoading } = useAppContext();

  if (!userId && props.playlistSource === "Own") {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return (
    <MePlaylistClass setLoading={setLoading} deezerToken={deezerToken} userId={userId} classes={classes} {...props} />
  );
});
