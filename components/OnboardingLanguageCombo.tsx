import { Manrope_600SemiBold, useFonts } from '@expo-google-fonts/manrope';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, Text } from 'react-native';

import { useNotation } from '@/contexts/notation-context';
import { LANGUAGE_META, UI_LANGUAGES, type UiLanguage } from '@/lib/i18n/types';

type LanguageComboProps = {
  compact?: boolean;
};

export function LanguageCombo({ compact = false }: LanguageComboProps) {
  const { uiLanguage, setUiLanguage, t } = useNotation();
  const [fontsLoaded] = useFonts({ Manrope_600SemiBold });
  const [visible, setVisible] = React.useState(false);
  const current = LANGUAGE_META[uiLanguage];

  const selectLanguage = (language: UiLanguage) => {
    setUiLanguage(language);
    setVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        hitSlop={8}
        style={({ pressed }) => ({
          minWidth: compact ? 58 : undefined,
          height: compact ? 38 : 46,
          borderRadius: compact ? 19 : 16,
          borderWidth: 1,
          borderColor: '#d9e4f4',
          backgroundColor: '#f7fbff',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: compact ? 9 : 12,
          gap: 5,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Text style={{ fontSize: compact ? 16 : 18 }}>{current.flag}</Text>
        <Text
          style={{
            color: '#4b688d',
            fontSize: compact ? 13 : 15,
            fontFamily: fontsLoaded ? 'Manrope_600SemiBold' : undefined,
          }}
        >
          {current.shortLabel}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={compact ? 15 : 18} color="#4b688d" />
      </Pressable>

      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable
          onPress={() => setVisible(false)}
          style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.28)', justifyContent: 'center', padding: 24 }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              borderRadius: 22,
              backgroundColor: '#ffffff',
              padding: 16,
              shadowColor: '#000',
              shadowOpacity: 0.16,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 10 },
              elevation: 8,
            }}
          >
            <Text
              style={{
                color: '#1c2430',
                fontSize: 20,
                marginBottom: 10,
                fontFamily: fontsLoaded ? 'Manrope_600SemiBold' : undefined,
              }}
            >
              {t('languagePickTitle')}
            </Text>
            {UI_LANGUAGES.map((language) => {
              const meta = LANGUAGE_META[language];
              const selected = language === uiLanguage;
              return (
                <Pressable
                  key={language}
                  onPress={() => selectLanguage(language)}
                  style={{
                    minHeight: 48,
                    borderRadius: 14,
                    paddingHorizontal: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    backgroundColor: selected ? '#edf6ff' : '#ffffff',
                  }}
                >
                  <Text style={{ fontSize: 22 }}>{meta.flag}</Text>
                  <Text
                    style={{
                      flex: 1,
                      color: '#1c2430',
                      fontSize: 16,
                      fontFamily: fontsLoaded ? 'Manrope_600SemiBold' : undefined,
                    }}
                  >
                    {meta.nativeLabel}
                  </Text>
                  {selected ? <MaterialCommunityIcons name="check" size={20} color="#2F80ED" /> : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

/**
 * Sélecteur compact langue d’interface (même stockage que l’écran Paramètres).
 */
export function OnboardingLanguageCombo() {
  return <LanguageCombo compact />;
}
