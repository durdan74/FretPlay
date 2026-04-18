import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { NotationSystem } from '@/app/(tabs)/bass/constants';
import type { TranslationKey } from '@/lib/i18n/strings';
import { translate } from '@/lib/i18n/strings';
import type { UiLanguage } from '@/lib/i18n/types';
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
  uiLanguage: UiLanguage;
  setUiLanguage: (value: UiLanguage) => void;
  onboardingCompleted: boolean;
  completeOnboarding: () => void;
  /** Temporaire — tests : remet l’intro à afficher et persiste. */
  resetOnboardingForDev: () => void;
  t: (key: TranslationKey) => string;
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

  const setUiLanguage = useCallback((value: UiLanguage) => {
    setSettings((prev) => {
      const next: AppSettings = {
        ...prev,
        settingsVersion: APP_SETTINGS_VERSION,
        uiLanguage: value,
      };
      void saveAppSettings(next);
      return next;
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    setSettings((prev) => {
      const next: AppSettings = {
        ...prev,
        settingsVersion: APP_SETTINGS_VERSION,
        onboardingCompleted: true,
      };
      void saveAppSettings(next);
      return next;
    });
  }, []);

  const resetOnboardingForDev = useCallback(() => {
    setSettings((prev) => {
      const next: AppSettings = {
        ...prev,
        settingsVersion: APP_SETTINGS_VERSION,
        onboardingCompleted: false,
      };
      void saveAppSettings(next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translate(settings.uiLanguage, key),
    [settings.uiLanguage],
  );

  const value = useMemo(
    () => ({
      notation: settings.notation,
      indicateString: settings.indicateString,
      setNotation,
      setIndicateString,
      uiLanguage: settings.uiLanguage,
      setUiLanguage,
      onboardingCompleted: settings.onboardingCompleted,
      completeOnboarding,
      resetOnboardingForDev,
      t,
      isHydrated,
    }),
    [
      settings.notation,
      settings.indicateString,
      settings.uiLanguage,
      settings.onboardingCompleted,
      setNotation,
      setIndicateString,
      setUiLanguage,
      completeOnboarding,
      resetOnboardingForDev,
      t,
      isHydrated,
    ],
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
