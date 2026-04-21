import { Manrope_400Regular, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ONBOARDING_COLORS } from './theme';
import { AnimatedNextButton } from './AnimatedNextButton';
import { OnboardingContainer } from './OnboardingContainer';
import { OnboardingHeader } from './OnboardingHeader';

export function OnboardingMessageScreen({
  progress,
  title,
  description,
  onBack,
  onNext,
  nextLabel = 'Continuer',
}: {
  progress: number;
  title: string;
  description: string;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_700Bold,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'bottom']}>
      <OnboardingContainer>
        <View style={{ flex: 1, paddingTop: 20, paddingHorizontal: 20 }}>
          <OnboardingHeader progress={progress} onBack={onBack} />

          <Text
            style={{
              fontSize: 33,
              fontWeight: '500',
              color: ONBOARDING_COLORS.title,
              lineHeight: 40,
              fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined,
            }}
          >
            {title}
          </Text>
          <View
            style={{
              marginTop: 24,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: '#d8e4f2',
              backgroundColor: '#eff5ff',
              flex: 1,
              minHeight: 240,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 16,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: '#7a8fae',
                fontSize: 14,
                lineHeight: 21,
                fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined,
              }}
            >
              Zone graphique placeholder (tu peux insérer ton visuel ici)
            </Text>
          </View>

          <Text
            style={{
              marginTop: 18,
              color: ONBOARDING_COLORS.textSecondary,
              fontSize: 16,
              lineHeight: 23,
              fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined,
            }}
          >
            {description}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: insets.bottom + 20 }}>
          <AnimatedNextButton onPress={onNext} title={nextLabel} />
        </View>
      </OnboardingContainer>
    </SafeAreaView>
  );
}
