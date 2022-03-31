import * as React from "react";
import { useLocation } from "react-router";
import SpotifyWebApi from "spotify-web-api-node";
import { useDeezerAuth } from "../../context/deezer-context";
import { useSpotifyAuth } from "../../context/spotify-context";
import { useUserContext } from "../../context/user-context";
import { useYoutubeAuth } from "../../context/youtube-context";
import { handleOnLogin } from "../../helpers/api-login";
import { HomeLandingPage } from "./home-landing-page";

interface Props {
  spotifyApi: SpotifyWebApi;
}

class HomeClass extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { spotifyApi } = this.props;

    return <HomeLandingPage spotifyApi={spotifyApi} />;
  }
}

export const Home = React.memo<Props>((props) => {
  const { spotifyToken } = useSpotifyAuth();
  const { deezerToken, deezerUserId } = useDeezerAuth();
  const { youtubeToken, googleAuthObject } = useYoutubeAuth();
  const { setUserId } = useUserContext();
  const location = useLocation();

  React.useEffect(() => {
    if (youtubeToken && googleAuthObject) {
      handleOnLogin(
        {
          DeezerUniqueIdentifier: "",
          SpotifyUniqueIdentifier: "",
          YoutubeUniqueIdentifier: googleAuthObject.currentUser.get().getId()
        },
        setUserId
      );
    }

    const { spotifyApi } = props;

    if (spotifyToken) {
      spotifyApi.getMe().then((me) => {
        handleOnLogin(
          {
            DeezerUniqueIdentifier: "",
            SpotifyUniqueIdentifier: me.body.id,
            YoutubeUniqueIdentifier: ""
          },
          setUserId
        );
      });
    }

    if (deezerToken && deezerUserId) {
      handleOnLogin(
        {
          DeezerUniqueIdentifier: deezerUserId,
          SpotifyUniqueIdentifier: "",
          YoutubeUniqueIdentifier: ""
        },
        setUserId
      );
    }
  }, [location]);

  return <HomeClass {...props} />;
});
