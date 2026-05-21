export type UiLanguage = 'fr' | 'en' | 'es' | 'it' | 'de';

export const UI_LANGUAGES: readonly UiLanguage[] = ['fr', 'en', 'es', 'it', 'de'] as const;

export const LANGUAGE_META: Record<UiLanguage, { flag: string; shortLabel: string; nativeLabel: string }> = {
  fr: { flag: '🇫🇷', shortLabel: 'FR', nativeLabel: 'Français' },
  en: { flag: '🇬🇧', shortLabel: 'EN', nativeLabel: 'English' },
  es: { flag: '🇪🇸', shortLabel: 'ES', nativeLabel: 'Español' },
  it: { flag: '🇮🇹', shortLabel: 'IT', nativeLabel: 'Italiano' },
  de: { flag: '🇩🇪', shortLabel: 'DE', nativeLabel: 'Deutsch' },
};
