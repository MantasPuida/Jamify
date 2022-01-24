import * as React from "react";
import * as auth from "../utils/auth";

interface AuthContextType {
  token: string | null;
  logout: () => void;
  register: Function;
}

const AuthContext = React.createContext<AuthContextType | null>(null);
AuthContext.displayName = "AuthContext";

// eslint-disable-next-line react/function-component-definition
function SpotifyAuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = React.useState<null | string>(() => auth.getUserToken());

  const register = React.useCallback(
    async (token) => {
      await auth.register(token).then((data) => setUserToken(data as string));
    },
    [setUserToken]
  );

  const logout = React.useCallback(() => {
    auth.logout();
    setUserToken(null);
  }, [setUserToken]);

  const value = React.useMemo(() => ({ token: userToken, register, logout }), [userToken, register, logout]);

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
