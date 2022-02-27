import * as React from "react";

interface AppContextType {
  loading: boolean;
  setLoading: Function;
}

const AppContext = React.createContext<AppContextType | null>(null);
AppContext.displayName = "AppContext";

function AppProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState<boolean>(true);

  const value = React.useMemo(() => ({ loading, setLoading }), [loading, setLoading]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useAppContext() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
}

export { AppProvider, useAppContext };
