import * as React from "react";

export interface TrackObject {
  title: string;
  thumbnail: string;
  channelTitle: string;
  videoId: string;
}

interface PlayerContextType {
  isOpen: boolean;
  setOpen: Function;
  track?: TrackObject;
  setTrack: Function;
  position: number;
  setPosition: Function;
  volume: number;
  setVolume: Function;
  duration: number;
  setDuration: Function;
  paused: boolean;
  setPaused: Function;
}

const PlayerContext = React.createContext<PlayerContextType | null>(null);
PlayerContext.displayName = "PlayerContext";

function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = React.useState<boolean>(false);
  const [track, setTrack] = React.useState<TrackObject>();
  const [position, setPosition] = React.useState<number>(0);
  const [volume, setVolume] = React.useState<number>(0.5);
  const [duration, setDuration] = React.useState<number>(0);
  const [paused, setPaused] = React.useState<boolean>(false);

  const value = React.useMemo(
    () => ({
      isOpen,
      setOpen,
      track,
      setTrack,
      position,
      setPosition,
      volume,
      setVolume,
      duration,
      setDuration,
      paused,
      setPaused
    }),
    [
      isOpen,
      setOpen,
      track,
      setTrack,
      position,
      setPosition,
      volume,
      setVolume,
      duration,
      setDuration,
      paused,
      setPaused
    ]
  );

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
