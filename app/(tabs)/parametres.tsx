import { router, type Href } from 'expo-router';
import { Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { NotationSystem } from '@/app/(tabs)/bass/constants';
import { useNotation } from '@/contexts/notation-context';

import { useParametresReturn } from './parametres-return-context';

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
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  const { returnTab } = useParametresReturn();
  const { notation, setNotation, indicateString, setIndicateString, t } = useNotation();

  const handleRetour = () => {
    const href: Href =
      returnTab === 'index' ? '/(tabs)' : returnTab === 'jeu-2' ? '/(tabs)/jeu-2' : '/(tabs)/jeu-1';
    router.navigate(href);
  };

  const setSystem = (value: NotationSystem) => {
    setNotation(value);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: 56,
        paddingBottom: 24,
        paddingHorizontal: 20,
      }}
    >
      <Text style={{ fontSize: 30, fontWeight: '700', marginBottom: 18, color: '#1a2432', fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
        {t('parametresTitle')}
      </Text>

      <View
        style={{
          marginBottom: 18,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: '#dce7f4',
          backgroundColor: '#f7fbff',
          paddingHorizontal: 14,
          paddingTop: 14,
          paddingBottom: 10,
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: '600', marginBottom: 8, color: '#2a3a50', fontFamily: fontsLoaded ? 'Manrope_600SemiBold' : undefined }}>
          {t('parametresNotationTitle')}
        </Text>
        <Text style={{ fontSize: 14, color: '#5f6f83', marginBottom: 12, lineHeight: 21, fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined }}>
          {t('parametresNotationBody')}
        </Text>
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

      <View
        style={{
          marginBottom: 24,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: '#dce7f4',
          backgroundColor: '#f7fbff',
          paddingHorizontal: 14,
          paddingTop: 14,
          paddingBottom: 10,
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: '600', marginBottom: 8, color: '#2a3a50', fontFamily: fontsLoaded ? 'Manrope_600SemiBold' : undefined }}>
          {t('parametresDifficultyTitle')}
        </Text>
        <Text style={{ fontSize: 14, color: '#5f6f83', marginBottom: 10, lineHeight: 21, fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined }}>
          {t('parametresDifficultyBody')}
        </Text>
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
          paddingVertical: 13,
          paddingHorizontal: 20,
          borderRadius: 14,
          backgroundColor: '#2F80ED',
        }}
      >
        <Text style={{ color: 'white', fontSize: 17, fontWeight: '700', fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
          {t('parametresRetour')}
        </Text>
      </Pressable>
    </View>
  );
}
