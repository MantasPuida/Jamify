import * as React from "react";
import * as auth from "../utils/auth";

interface AuthContextType {
  youtubeToken: string | null;
  logout: () => void;
  register: Function;
  setGoogleAuthObject: Function;
  googleAuthObject: gapi.auth2.GoogleAuthBase | undefined;
}

const AuthContext = React.createContext<AuthContextType | null>(null);
AuthContext.displayName = "AuthContext";

function YoutubeAuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = React.useState<null | string>(() => auth.getUserToken("__youtube_auth_token__"));
  const [googleAuthObject, setGoogleObject] = React.useState<gapi.auth2.GoogleAuth>();

  const setGoogleAuthObject = React.useCallback(
    async (googleObject: gapi.auth2.GoogleAuth) => {
      setGoogleObject(googleObject);
    },
    [setGoogleObject]
  );

  const register = React.useCallback(
    async (youtubeToken) => {
      await auth.register(youtubeToken, "__youtube_auth_token__").then((data) => setUserToken(data as string));
    },
    [setUserToken]
  );

  const logout = React.useCallback(() => {
    auth.logout("__youtube_auth_token__");
    setUserToken(null);
    googleAuthObject?.signOut();
    googleAuthObject?.disconnect();
  }, [setUserToken]);

  const value = React.useMemo(
    () => ({ youtubeToken: userToken, register, logout, setGoogleAuthObject, googleAuthObject }),
    [userToken, register, logout, setGoogleAuthObject, googleAuthObject]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useYoutubeAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useYoutubeAuth must be used within a YoutubeAuthProvider");
  }
  return context;
}

export { YoutubeAuthProvider, useYoutubeAuth };
