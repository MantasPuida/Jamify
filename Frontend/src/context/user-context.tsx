import * as React from "react";

interface UserContextType {
  userId?: string;
  setUserId: Function;
}

const UserContext = React.createContext<UserContextType | null>(null);
UserContext.displayName = "UserContext";

function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = React.useState<string>();

  const value = React.useMemo(() => ({ userId, setUserId }), [userId, setUserId]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function useUserContext() {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a AppProvider");
  }
  return context;
}

export { UserProvider, useUserContext };
