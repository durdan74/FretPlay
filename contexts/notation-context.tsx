import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { NotationSystem } from '@/app/(tabs)/bass/constants';
import {
  APP_SETTINGS_VERSION,
  getDefaultAppSettings,
  loadAppSettings,
  saveAppSettings,
  type AppSettings,
} from '@/storage/appSettings';

export { getDefaultNotationFromLocale } from '@/lib/defaultNotation';

type AppSettingsContextValue = {
  notation: NotationSystem;
  indicateString: boolean;
  setNotation: (value: NotationSystem) => void;
  setIndicateString: (value: boolean) => void;
  isHydrated: boolean;
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function NotationProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(getDefaultAppSettings);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const loaded = await loadAppSettings();
        if (cancelled) return;
        setSettings(loaded);
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
    setSettings((prev) => {
      const next: AppSettings = {
        ...prev,
        settingsVersion: APP_SETTINGS_VERSION,
        notation: value,
      };
      void saveAppSettings(next);
      return next;
    });
  }, []);

  const setIndicateString = useCallback((value: boolean) => {
    setSettings((prev) => {
      const next: AppSettings = {
        ...prev,
        settingsVersion: APP_SETTINGS_VERSION,
        indicateString: value,
      };
      void saveAppSettings(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      notation: settings.notation,
      indicateString: settings.indicateString,
      setNotation,
      setIndicateString,
      isHydrated,
    }),
    [settings.notation, settings.indicateString, setNotation, setIndicateString, isHydrated],
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useNotation() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    throw new Error('useNotation must be used within NotationProvider');
  }
  return ctx;
}
