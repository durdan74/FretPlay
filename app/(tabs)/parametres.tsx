import { router, type Href } from 'expo-router';
import { Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import type { NotationSystem } from '@/app/(tabs)/bass/constants';
import { LanguageCombo } from '@/components/OnboardingLanguageCombo';
import { useNotation } from '@/contexts/notation-context';
import { usePurchases } from '@/contexts/purchases-context';
import { MAX_PLAYABLE_FRET, MIN_PLAYABLE_FRET } from '@/storage/appSettings';
import { resetPaywallAccess } from '@/storage/paywallAccess';

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

function StepButton({ label, disabled, onPress }: { label: string; disabled: boolean; onPress: () => void }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: disabled ? '#d7e1ec' : '#2F80ED',
      }}
    >
      <Text style={{ color: 'white', fontSize: 24, fontWeight: '800' }}>{label}</Text>
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
  const {
    notation,
    setNotation,
    indicateString,
    setIndicateString,
    maxPlayableFret,
    setMaxPlayableFret,
    resetOnboardingForDev,
    t,
  } = useNotation();
  const { logOutPurchases } = usePurchases();

  const handleRetour = () => {
    const href: Href =
      returnTab === 'index' ? '/(tabs)' : returnTab === 'jeu-2' ? '/(tabs)/jeu-2' : '/(tabs)/jeu-1';
    router.navigate(href);
  };

  const setSystem = (value: NotationSystem) => {
    setNotation(value);
  };

  const handleLogout = () => {
    Alert.alert(
      t('settingsLogoutTitle'),
      t('settingsLogoutBody'),
      [
        { text: t('settingsLogoutCancel'), style: 'cancel' },
        {
          text: t('settingsLogoutAction'),
          style: 'destructive',
          onPress: () => {
            void (async () => {
              try {
                await resetPaywallAccess();
                await logOutPurchases();
              } finally {
                resetOnboardingForDev();
                router.replace('/landing');
              }
            })();
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: 56,
        paddingBottom: 24,
        paddingHorizontal: 20,
      }}
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
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
          {t('parametresLanguageTitle')}
        </Text>
        <LanguageCombo />
      </View>

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
        <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#dce7f4' }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#2a3a50', fontFamily: fontsLoaded ? 'Manrope_600SemiBold' : undefined }}>
            {t('parametresMaxFretTitle')}
          </Text>
          <Text style={{ fontSize: 14, color: '#5f6f83', marginTop: 6, marginBottom: 12, lineHeight: 21, fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined }}>
            {t('parametresMaxFretBody')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <StepButton
              label="-"
              disabled={maxPlayableFret <= MIN_PLAYABLE_FRET}
              onPress={() => setMaxPlayableFret(maxPlayableFret - 1)}
            />
            <View
              style={{
                minWidth: 86,
                height: 44,
                borderRadius: 12,
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#dce7f4',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: '800', color: '#1a2432', fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
                {maxPlayableFret}
              </Text>
            </View>
            <StepButton
              label="+"
              disabled={maxPlayableFret >= MAX_PLAYABLE_FRET}
              onPress={() => setMaxPlayableFret(maxPlayableFret + 1)}
            />
          </View>
          <Text style={{ fontSize: 13, color: '#5f6f83', marginTop: 10, fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined }}>
            {maxPlayableFret === 0
              ? t('parametresMaxFretOpenOnly')
              : `${t('parametresMaxFretRangePrefix')} ${maxPlayableFret}`}
          </Text>
        </View>
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

      <Pressable
        onPress={handleLogout}
        style={{
          alignSelf: 'stretch',
          marginTop: 18,
          paddingVertical: 13,
          paddingHorizontal: 20,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: '#fecaca',
          backgroundColor: '#fff5f5',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#b91c1c', fontSize: 16, fontWeight: '700', fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
          {t('settingsLogoutAction')}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
