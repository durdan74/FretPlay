import * as Localization from 'expo-localization';

import type { UiLanguage } from '@/lib/i18n/types';

/**
 * Langue d’interface par défaut selon la locale : FR / ES / DE / IT si correspondant, sinon EN.
 */
export function getDefaultUiLanguageFromLocale(): UiLanguage {
  const locales = Localization.getLocales();
  const lang = (locales[0]?.languageCode ?? 'en').toLowerCase();
  if (lang.startsWith('fr')) {
    return 'fr';
  }
  if (lang.startsWith('es')) {
    return 'es';
  }
  if (lang.startsWith('de')) {
    return 'de';
  }
  if (lang.startsWith('it')) {
    return 'it';
  }
  return 'en';
}
