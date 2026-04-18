import React, { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type ReturnableTabName = 'index' | 'jeu-1' | 'jeu-2';

type ParametresReturnContextValue = {
  returnTab: ReturnableTabName;
  setReturnTab: (name: ReturnableTabName) => void;
};

const ParametresReturnContext = createContext<ParametresReturnContextValue | null>(null);

export function ParametresReturnProvider({ children }: { children: ReactNode }) {
  const [returnTab, setReturnTabState] = useState<ReturnableTabName>('index');

  const setReturnTab = useCallback((name: ReturnableTabName) => {
    setReturnTabState(name);
  }, []);

  const value = useMemo(() => ({ returnTab, setReturnTab }), [returnTab, setReturnTab]);

  return <ParametresReturnContext.Provider value={value}>{children}</ParametresReturnContext.Provider>;
}

export function useParametresReturn() {
  const ctx = useContext(ParametresReturnContext);
  if (!ctx) {
    throw new Error('useParametresReturn must be used within ParametresReturnProvider');
  }
  return ctx;
}
