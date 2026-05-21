import * as Localization from 'expo-localization';

import type { UiLanguage } from '@/lib/i18n/types';

export function getDefaultUiLanguageFromLocale(): UiLanguage {
  const locales = Localization.getLocales();
  const languageCode = locales[0]?.languageCode?.toLowerCase();
  if (languageCode === 'fr' || languageCode === 'en' || languageCode === 'es' || languageCode === 'it' || languageCode === 'de') {
    return languageCode;
  }
  return 'en';
}
