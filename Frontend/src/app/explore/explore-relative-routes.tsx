import * as React from "react";
import { Routes, Route } from "react-router";
import SpotifyWebApi from "spotify-web-api-node";
import { Explore } from "./explore-component";
import { ExplorePlaylists } from "./explore-genre-playlists";

interface OuterProps {
  spotifyApi: SpotifyWebApi;
}

class RelativeExploreRoutesClass extends React.PureComponent<OuterProps> {
  public render(): React.ReactNode {
    const { spotifyApi } = this.props;

    return (
      <Routes>
        <Route index={true} element={<Explore spotifyApi={spotifyApi} />} />
        <Route path=":id" element={<ExplorePlaylists />} />
      </Routes>
    );
  }
}

// eslint-disable-next-line arrow-body-style
export const RelativeExploreRoutes = React.memo<OuterProps>((props) => {
  return <RelativeExploreRoutesClass {...props} />;
});
