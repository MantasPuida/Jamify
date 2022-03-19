import * as React from "react";
import * as auth from "../utils/auth";

interface AuthContextType {
  deezerToken: string | null;
  logout: () => void;
  register: Function;
}

const AuthContext = React.createContext<AuthContextType | null>(null);
AuthContext.displayName = "AuthContext";

function DeezerAuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = React.useState<null | string>(() => auth.getUserToken("__deezer_auth_token__"));

  const register = React.useCallback(
    async (deezerToken) => {
      await auth.register(deezerToken, "__deezer_auth_token__").then((data) => setUserToken(data as string));
    },
    [setUserToken]
  );

  const logout = React.useCallback(() => {
    auth.logout("__deezer_auth_token__");
    setUserToken(null);
  }, [setUserToken]);

  const value = React.useMemo(() => ({ deezerToken: userToken, register, logout }), [userToken, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useDeezerAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useDeezerAuth must be used within a DeezerAuthProvider");
  }
  return context;
}

export { DeezerAuthProvider, useDeezerAuth };
