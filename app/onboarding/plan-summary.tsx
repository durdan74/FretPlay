import { Manrope_400Regular, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedNextButton } from '@/components/onboarding/AnimatedNextButton';
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { useNotation } from '@/contexts/notation-context';
import { useOnboardingFlow } from '@/contexts/onboarding-flow-context';
import type { TranslationKey } from '@/lib/i18n/strings';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

function resultDelayKey(segment: string | null): TranslationKey {
  if (segment === 'Débutant') return 'onboardingSummaryDelayBeginner';
  if (segment === 'Amateur') return 'onboardingSummaryDelayAmateur';
  return 'onboardingSummaryDelayPro';
}

export default function OnboardingPlanSummaryScreen() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_700Bold,
  });
  const { blockers, dailyTime, goal, segment, resetFlow } = useOnboardingFlow();
  const { completeOnboarding, t } = useNotation();

  const firstBlocker = blockers?.[0] ?? t('onboardingSummaryFallbackBlocker');
  const rhythm = dailyTime ?? t('onboardingPlan10Min');
  const mainGoal = goal ?? t('onboardingSummaryFallbackGoal');
  const level = segment ?? t('onboardingSummaryFallbackLevel');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'bottom']}>
      <OnboardingContainer>
        <View style={{ flex: 1, paddingTop: 20, paddingHorizontal: 20 }}>
          <OnboardingHeader progress={getOnboardingProgress('plan_summary')} onBack={() => router.back()} />

          <Text style={{ fontSize: 30, lineHeight: 37, color: '#161e29', fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
            {t('onboardingSummaryReadyTitle')}
          </Text>
          <Text
            style={{
              marginTop: 10,
              fontSize: 16,
              lineHeight: 23,
              color: '#5f6f83',
              fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined,
            }}
          >
            {t('onboardingSummaryReadyBody')}
          </Text>

          <View
            style={{
              marginTop: 18,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#dce7f4',
              backgroundColor: '#f6f9ff',
              padding: 16,
              gap: 9,
            }}
          >
            <Text style={{ fontSize: 16, color: '#1f2b39', fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>🎯 {t('onboardingSummaryFocus')} : {firstBlocker}</Text>
            <Text style={{ fontSize: 16, color: '#1f2b39', fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>⏱️ {t('onboardingSummaryRhythm')} : {rhythm} {t('onboardingSummaryPerDay')}</Text>
            <Text style={{ fontSize: 16, color: '#1f2b39', fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>📈 {t('onboardingSummaryGoal')} : {mainGoal}</Text>
            <Text style={{ fontSize: 16, color: '#1f2b39', fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>🎸 {t('onboardingSummaryLevel')} : {level}</Text>
          </View>

          <Text
            style={{
              marginTop: 16,
              fontSize: 18,
              lineHeight: 27,
              color: '#2b4567',
              fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined,
            }}
          >
            {t(resultDelayKey(segment))}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 }}>
          <AnimatedNextButton
            onPress={() => {
              completeOnboarding?.();
              resetFlow?.();
              router.replace('/(tabs)');
            }}
            title={t('landingCta')}
          />
        </View>
      </OnboardingContainer>
    </SafeAreaView>
  );
}
