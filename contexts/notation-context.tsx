import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { NotationSystem } from '@/app/(tabs)/bass/constants';
import { APP_SETTINGS_VERSION, loadAppSettings, saveAppSettings, type AppSettings } from '@/storage/appSettings';
import { getDefaultNotationFromLocale } from '@/lib/defaultNotation';

export { getDefaultNotationFromLocale } from '@/lib/defaultNotation';

type NotationContextValue = {
  notation: NotationSystem;
  setNotation: (value: NotationSystem) => void;
  isHydrated: boolean;
};

const NotationContext = createContext<NotationContextValue | null>(null);

export function NotationProvider({ children }: { children: ReactNode }) {
  const [notation, setNotationState] = useState<NotationSystem>(() => getDefaultNotationFromLocale());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const loaded = await loadAppSettings();
        if (cancelled) return;
        setNotationState(loaded.notation);
      } finally {
        if (!cancelled) {
          setIsHydrated(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setNotation = useCallback((value: NotationSystem) => {
    setNotationState(value);
    const payload: AppSettings = {
      settingsVersion: APP_SETTINGS_VERSION,
      notation: value,
    };
    void saveAppSettings(payload);
  }, []);

  const value = useMemo(
    () => ({ notation, setNotation, isHydrated }),
    [notation, setNotation, isHydrated],
  );

  return <NotationContext.Provider value={value}>{children}</NotationContext.Provider>;
}

export function useNotation() {
  const ctx = useContext(NotationContext);
  if (!ctx) {
    throw new Error('useNotation must be used within NotationProvider');
  }
  return ctx;
}
