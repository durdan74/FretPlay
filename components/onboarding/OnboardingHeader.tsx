import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import React from 'react';
import { Pressable, View } from 'react-native';

import { OnboardingLanguageCombo } from '@/components/OnboardingLanguageCombo';

import { GradientProgressBar } from './GradientProgressBar';

export function OnboardingHeader({
  progress,
  onBack,
  disableBack = false,
}: {
  progress: number;
  onBack: () => void;
  disableBack?: boolean;
}) {
  useFonts({ Manrope_700Bold });

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
      {disableBack ? (
        <View style={{ width: 40, height: 40 }} />
      ) : (
        <Pressable
          onPress={onBack}
          hitSlop={8}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#d9e4f4',
            backgroundColor: '#f7fbff',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.04,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 1,
          }}
        >
          <MaterialCommunityIcons name="chevron-left" size={22} color="#2e3f56" />
        </Pressable>
      )}

      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <GradientProgressBar percentage={progress} height={5} />
      </View>

      <OnboardingLanguageCombo />
    </View>
  );
}
