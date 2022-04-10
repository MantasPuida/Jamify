import * as React from "react";

interface YoutubeApiContextType {
  minePlaylist?: gapi.client.Response<gapi.client.youtube.PlaylistListResponse>;
  setMinePlaylist: React.Dispatch<
    React.SetStateAction<gapi.client.Response<gapi.client.youtube.PlaylistListResponse> | undefined>
  >;
}

const YoutubeApiContext = React.createContext<YoutubeApiContextType | null>(null);
YoutubeApiContext.displayName = "YoutubeApiContext";

function YoutubeApiProvider({ children }: { children: React.ReactNode }) {
  const [minePlaylist, setMinePlaylist] =
    React.useState<gapi.client.Response<gapi.client.youtube.PlaylistListResponse>>();

  const value = React.useMemo(() => ({ minePlaylist, setMinePlaylist }), [minePlaylist, setMinePlaylist]);

  return <YoutubeApiContext.Provider value={value}>{children}</YoutubeApiContext.Provider>;
}

function useYoutubeApiContext() {
  const context = React.useContext(YoutubeApiContext);
  if (!context) {
    throw new Error("useYoutubeApiContext must be used within a YoutubeApiProvider");
  }
  return context;
}

export { YoutubeApiProvider, useYoutubeApiContext };
