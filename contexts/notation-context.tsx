import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { NotationSystem } from '@/app/(tabs)/bass/constants';

const STORAGE_KEY = '@notesbasse/notation_system';

export function getDefaultNotationFromLocale(): NotationSystem {
  const locales = Localization.getLocales();
  const lang = (locales[0]?.languageCode ?? 'fr').toLowerCase();
  if (lang === 'en') {
    return 'anglo-saxon';
  }
  return 'european';
}

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
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (stored === 'european' || stored === 'anglo-saxon') {
          setNotationState(stored);
        }
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
    void AsyncStorage.setItem(STORAGE_KEY, value);
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
