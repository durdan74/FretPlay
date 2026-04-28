import { Manrope_400Regular, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
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
  disableBack = false,
}: {
  progress: number;
  title: string;
  description: string;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  disableBack?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_700Bold,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'bottom']}>
      <OnboardingContainer>
        <View style={{ paddingTop: 20, paddingHorizontal: 20 }}>
          <OnboardingHeader progress={progress} onBack={onBack} disableBack={disableBack} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
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
              height: 240,
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
              marginBottom: 8,
              color: ONBOARDING_COLORS.textSecondary,
              fontSize: 16,
              lineHeight: 23,
              fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined,
            }}
          >
            {description}
          </Text>
        </ScrollView>

        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: insets.bottom + 20 }}>
          <AnimatedNextButton onPress={onNext} title={nextLabel} />
        </View>
      </OnboardingContainer>
    </SafeAreaView>
  );
}
