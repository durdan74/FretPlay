import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

import { useNotation } from '@/contexts/notation-context';
import type { TranslationKey } from '@/lib/i18n/strings';
import type { UiLanguage } from '@/lib/i18n/types';
import { UI_LANGUAGES } from '@/lib/i18n/types';

const FLAG_EMOJI: Record<UiLanguage, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
  es: '🇪🇸',
  de: '🇩🇪',
  it: '🇮🇹',
};

const LANGUAGE_LABEL_KEYS: Record<UiLanguage, TranslationKey> = {
  fr: 'languageFr',
  en: 'languageEn',
  es: 'languageEs',
  de: 'languageDe',
  it: 'languageIt',
};

/**
 * Sélecteur compact langue d’interface (même stockage que l’écran Paramètres).
 */
export function OnboardingLanguageCombo() {
  const { uiLanguage, setUiLanguage, t } = useNotation();
  const [open, setOpen] = useState(false);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const pillBg = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  const pillBorder = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.1)';
  const chevron = isDark ? '#d6d3d1' : '#57534e';

  const pick = (lang: UiLanguage) => {
    setUiLanguage(lang);
    setOpen(false);
  };

  return (
    <>
      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          top: 52,
          right: 14,
          zIndex: 50,
        }}
      >
        <Pressable
          onPress={() => setOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={t('parametresLanguageTitle')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 3,
            paddingVertical: 5,
            paddingHorizontal: 9,
            borderRadius: 18,
            backgroundColor: pillBg,
            borderWidth: 1,
            borderColor: pillBorder,
          }}
        >
          <Text style={{ fontSize: 19 }}>{FLAG_EMOJI[uiLanguage]}</Text>
          <Text style={{ fontSize: 10, color: chevron, fontWeight: '700' }}>▼</Text>
        </Pressable>
      </View>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1 }}>
          <Pressable style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.45)' }]} onPress={() => setOpen(false)} />
          <View pointerEvents="box-none" style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 28 }}>
            <View
              style={{
                backgroundColor: isDark ? '#292524' : '#fff',
                borderRadius: 14,
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderWidth: isDark ? 1 : 0,
                borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  marginBottom: 12,
                  paddingHorizontal: 4,
                  color: isDark ? '#fafaf9' : '#1c1917',
                }}
              >
                {t('languagePickTitle')}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
                {UI_LANGUAGES.map((lang) => {
                  const selected = uiLanguage === lang;
                  return (
                    <Pressable
                      key={lang}
                      onPress={() => pick(lang)}
                      style={{
                        alignItems: 'center',
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        borderRadius: 12,
                        backgroundColor: selected ? (isDark ? 'rgba(31,111,235,0.35)' : '#e8f0fe') : 'transparent',
                        borderWidth: 1,
                        borderColor: selected ? '#1f6feb' : (isDark ? 'rgba(255,255,255,0.1)' : '#e7e5e4'),
                        minWidth: 76,
                      }}
                    >
                      <Text style={{ fontSize: 28, marginBottom: 4 }}>{FLAG_EMOJI[lang]}</Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 12,
                          fontWeight: selected ? '700' : '500',
                          color: isDark ? '#e7e5e4' : '#44403c',
                        }}
                      >
                        {t(LANGUAGE_LABEL_KEYS[lang])}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
