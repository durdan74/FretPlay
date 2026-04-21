import * as Localization from 'expo-localization';

import type { UiLanguage } from '@/lib/i18n/types';

export function getDefaultUiLanguageFromLocale(): UiLanguage {
  const locales = Localization.getLocales();
  void locales;
  return 'fr';
}
