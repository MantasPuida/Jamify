import * as React from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { useDeezerAuth } from "../../context/deezer-context";
import { useSpotifyAuth } from "../../context/spotify-context";
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
  const { deezerToken } = useDeezerAuth();
  const { youtubeToken, googleAuthObject } = useYoutubeAuth();

  if (youtubeToken && googleAuthObject) {
    handleOnLogin({
      DeezerUniqueIdentifier: "",
      SpotifyUniqueIdentifier: "",
      YoutubeUniqueIdentifier: googleAuthObject.currentUser.get().getId()
    });
  }

  if (deezerToken) {
    DZ.getLoginStatus((status) => {
      handleOnLogin({
        DeezerUniqueIdentifier: status.authResponse.userID,
        SpotifyUniqueIdentifier: "",
        YoutubeUniqueIdentifier: ""
      });
    });
  }

  const { spotifyApi } = props;

  if (spotifyToken) {
    spotifyApi.getMe().then((me) => {
      handleOnLogin({
        DeezerUniqueIdentifier: "",
        SpotifyUniqueIdentifier: me.body.id,
        YoutubeUniqueIdentifier: ""
      });
    });
  }

  return <HomeClass {...props} />;
});
