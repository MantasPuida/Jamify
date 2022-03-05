import * as React from "react";

interface PlayerContextType {
  isOpen: boolean;
  setOpen: Function;
  track?: gapi.client.youtube.PlaylistItem;
  setTrack: Function;
}

const PlayerContext = React.createContext<PlayerContextType | null>(null);
PlayerContext.displayName = "PlayerContext";

function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = React.useState<boolean>(false);
  const [track, setTrack] = React.useState<gapi.client.youtube.PlaylistItem>();

  const value = React.useMemo(() => ({ isOpen, setOpen, track, setTrack }), [isOpen, setOpen, track, setTrack]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

function usePlayerContext() {
  const context = React.useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayerContext must be used within a AppProvider");
  }
  return context;
}

export { PlayerProvider, usePlayerContext };
