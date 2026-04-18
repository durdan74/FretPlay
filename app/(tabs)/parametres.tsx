import { router, type Href } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import type { NotationSystem } from '@/app/(tabs)/bass/constants';
import { useNotation } from '@/contexts/notation-context';
import type { TranslationKey } from '@/lib/i18n/strings';
import type { UiLanguage } from '@/lib/i18n/types';
import { UI_LANGUAGES } from '@/lib/i18n/types';

import { useParametresReturn } from './parametres-return-context';

const LANGUAGE_LABEL_KEYS: Record<UiLanguage, TranslationKey> = {
  fr: 'languageFr',
  en: 'languageEn',
  es: 'languageEs',
  de: 'languageDe',
  it: 'languageIt',
};

function RadioRow({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: selected ? '#1f6feb' : '#888',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected ? (
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: '#1f6feb',
            }}
          />
        ) : null}
      </View>
      <Text style={{ fontSize: 17 }}>{label}</Text>
    </Pressable>
  );
}

function CheckRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: checked ? '#1f6feb' : '#888',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: checked ? '#e8f0fe' : 'transparent',
        }}
      >
        {checked ? (
          <Text style={{ fontSize: 14, fontWeight: '900', color: '#1f6feb' }}>✓</Text>
        ) : null}
      </View>
      <Text style={{ fontSize: 17, flex: 1 }}>{label}</Text>
    </Pressable>
  );
}

export default function ParametresScreen() {
  const { returnTab } = useParametresReturn();
  const { notation, setNotation, indicateString, setIndicateString, uiLanguage, setUiLanguage, t } = useNotation();
  const [languageModalOpen, setLanguageModalOpen] = useState(false);

  const handleRetour = () => {
    const href: Href =
      returnTab === 'index' ? '/(tabs)' : returnTab === 'jeu-2' ? '/(tabs)/jeu-2' : '/(tabs)/jeu-1';
    router.navigate(href);
  };

  const setSystem = (value: NotationSystem) => {
    setNotation(value);
  };

  const pickLanguage = (lang: UiLanguage) => {
    setUiLanguage(lang);
    setLanguageModalOpen(false);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 64,
        paddingBottom: 24,
        paddingHorizontal: 16,
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 12 }}>{t('parametresTitle')}</Text>

      <Text style={{ fontSize: 17, fontWeight: '600', marginBottom: 8 }}>{t('parametresLanguageTitle')}</Text>
      <Pressable
        onPress={() => setLanguageModalOpen(true)}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 10,
          paddingVertical: 12,
          paddingHorizontal: 14,
          marginBottom: 28,
          backgroundColor: '#fafafa',
        }}
      >
        <Text style={{ fontSize: 17, color: '#111' }}>{t(LANGUAGE_LABEL_KEYS[uiLanguage])}</Text>
      </Pressable>

      <Text style={{ fontSize: 17, fontWeight: '600', marginBottom: 8 }}>{t('parametresNotationTitle')}</Text>
      <Text style={{ fontSize: 14, color: '#555', marginBottom: 12 }}>{t('parametresNotationBody')}</Text>

      <View style={{ marginBottom: 28 }}>
        <RadioRow
          label={t('parametresNotationEu')}
          selected={notation === 'european'}
          onSelect={() => setSystem('european')}
        />
        <RadioRow
          label={t('parametresNotationAnglo')}
          selected={notation === 'anglo-saxon'}
          onSelect={() => setSystem('anglo-saxon')}
        />
      </View>

      <Text style={{ fontSize: 17, fontWeight: '600', marginBottom: 8 }}>{t('parametresDifficultyTitle')}</Text>
      <Text style={{ fontSize: 14, color: '#555', marginBottom: 10 }}>{t('parametresDifficultyBody')}</Text>
      <View style={{ marginBottom: 28 }}>
        <CheckRow
          label={t('parametresIndicateString')}
          checked={indicateString}
          onToggle={() => setIndicateString(!indicateString)}
        />
      </View>

      <Pressable
        onPress={handleRetour}
        style={{
          alignSelf: 'flex-start',
          paddingVertical: 12,
          paddingHorizontal: 18,
          borderRadius: 10,
          backgroundColor: '#1f6feb',
        }}
      >
        <Text style={{ color: 'white', fontSize: 17, fontWeight: '700' }}>{t('parametresRetour')}</Text>
      </Pressable>

      <Modal transparent visible={languageModalOpen} animationType="fade" onRequestClose={() => setLanguageModalOpen(false)}>
        <View style={{ flex: 1 }}>
          <Pressable
            style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.45)' }]}
            onPress={() => setLanguageModalOpen(false)}
          />
          <View
            pointerEvents="box-none"
            style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}
          >
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 14,
                paddingVertical: 16,
                paddingHorizontal: 8,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12, paddingHorizontal: 12 }}>
                {t('languagePickTitle')}
              </Text>
              {UI_LANGUAGES.map((lang) => (
                <Pressable
                  key={lang}
                  onPress={() => pickLanguage(lang)}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor: uiLanguage === lang ? '#e8f0fe' : 'transparent',
                  }}
                >
                  <Text style={{ fontSize: 17, fontWeight: uiLanguage === lang ? '700' : '500' }}>
                    {t(LANGUAGE_LABEL_KEYS[lang])}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
