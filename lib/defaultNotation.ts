import * as Localization from 'expo-localization';

import type { NotationSystem } from '@/app/(tabs)/bass/constants';

export function getDefaultNotationFromLocale(): NotationSystem {
  const locales = Localization.getLocales();
  const lang = (locales[0]?.languageCode ?? 'fr').toLowerCase();
  if (lang === 'en') {
    return 'anglo-saxon';
  }
  return 'european';
}
