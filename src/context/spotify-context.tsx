import * as React from "react";
import * as auth from "../utils/auth";

interface AuthContextType {
  spotifyToken: string | null;
  logout: () => void;
  register: Function;
}

const AuthContext = React.createContext<AuthContextType | null>(null);
AuthContext.displayName = "AuthContext";

// eslint-disable-next-line react/function-component-definition
function SpotifyAuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = React.useState<null | string>(() => auth.getUserToken("__spotify_auth_token__"));

  const register = React.useCallback(
    async (spotifyToken) => {
      await auth.register(spotifyToken, "__spotify_auth_token__").then((data) => setUserToken(data as string));
    },
    [setUserToken]
  );

  const logout = React.useCallback(() => {
    auth.logout("__spotify_auth_token__");
    setUserToken(null);
  }, [setUserToken]);

  const value = React.useMemo(() => ({ spotifyToken: userToken, register, logout }), [userToken, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useSpotifyAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useSpotifyAuth must be used within a SpotifyAuthProvider");
  }
  return context;
}

export { SpotifyAuthProvider, useSpotifyAuth };
