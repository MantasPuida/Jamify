import * as React from "react";
import { useLocation } from "react-router";
import SpotifyWebApi from "spotify-web-api-node";
import { useAppContext } from "../../context/app-context";
import { useDeezerAuth } from "../../context/deezer-context";
import { useSpotifyAuth } from "../../context/spotify-context";
import { useUserContext } from "../../context/user-context";
import { useYoutubeAuth } from "../../context/youtube-context";
import { handleOnLogin } from "../../helpers/api-login";
import { HomeLandingPage } from "./home-landing-page";

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

interface InnerProps {}

type Props = InnerProps & OuterProps;

class HomeClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { spotifyApi } = this.props;

    return <HomeLandingPage spotifyApi={spotifyApi} />;
  }
}

export const Home = React.memo<OuterProps>((props) => {
  const { spotifyToken, logout } = useSpotifyAuth();
  const { deezerToken, deezerUserId } = useDeezerAuth();
  const { youtubeToken, googleAuthObject } = useYoutubeAuth();
  const { setUserId } = useUserContext();
  const location = useLocation();
  const { setLoading, loading } = useAppContext();

  React.useEffect(() => {
    if (!loading) {
      setLoading(true);
    }

    if (youtubeToken && googleAuthObject) {
      const email = googleAuthObject.currentUser.get().getBasicProfile().getEmail();
      const name = googleAuthObject.currentUser.get().getBasicProfile().getName();

      handleOnLogin(
        {
          DeezerUniqueIdentifier: "",
          SpotifyUniqueIdentifier: "",
          YoutubeUniqueIdentifier: googleAuthObject.currentUser.get().getId(),
          DeezerEmail: "",
          DeezerName: "",
          SpotifyEmail: "",
          SpotifyName: "",
          YoutubeEmail: email,
          YoutubeName: name
        },
        setUserId
      );
    }

    const { spotifyApi } = props;

    if (spotifyToken) {
      spotifyApi
        .getMe()
        .then((me) => {
          const { id, display_name: name, email } = me.body;

          handleOnLogin(
            {
              DeezerUniqueIdentifier: "",
              SpotifyUniqueIdentifier: id,
              YoutubeUniqueIdentifier: "",
              DeezerEmail: "",
              DeezerName: "",
              SpotifyEmail: email,
              SpotifyName: name ?? "",
              YoutubeEmail: "",
              YoutubeName: ""
            },
            setUserId
          );
        })
        .catch(() => {
          logout();
          setLoading(false);
        });
    }

    if (deezerToken && deezerUserId) {
      DZ.api(`user/me?access_token=${deezerToken}`, (response) => {
        const { email, name } = response;
        handleOnLogin(
          {
            DeezerUniqueIdentifier: deezerUserId,
            SpotifyUniqueIdentifier: "",
            YoutubeUniqueIdentifier: "",
            DeezerEmail: email,
            DeezerName: name,
            SpotifyEmail: "",
            SpotifyName: "",
            YoutubeEmail: "",
            YoutubeName: ""
          },
          setUserId
        );
      });
    }
  }, [location]);

  return <HomeClass {...props} />;
});
