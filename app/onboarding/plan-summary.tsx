import { Manrope_400Regular, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedNextButton } from '@/components/onboarding/AnimatedNextButton';
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { useNotation } from '@/contexts/notation-context';
import { useOnboardingFlow } from '@/contexts/onboarding-flow-context';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

function resultDelay(segment: string | null): string {
  if (segment === 'Débutant') return 'Tu devrais voir tes premiers résultats en 21 jours.';
  if (segment === 'Amateur') return 'Tu devrais voir tes premiers résultats en 30 jours.';
  return 'Tu devrais voir tes premiers résultats en 45 jours.';
}

export default function OnboardingPlanSummaryScreen() {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_700Bold,
  });
  const { blockers, dailyTime, goal, segment, resetFlow } = useOnboardingFlow();
  const { completeOnboarding } = useNotation();

  const firstBlocker = blockers?.[0] ?? 'Ta difficulté principale';
  const rhythm = dailyTime ?? '10 min';
  const mainGoal = goal ?? 'Progresser';
  const level = segment ?? 'Amateur';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'bottom']}>
      <OnboardingContainer>
        <View style={{ flex: 1, paddingTop: 20, paddingHorizontal: 20 }}>
          <OnboardingHeader progress={getOnboardingProgress('plan_summary')} onBack={() => router.back()} />

          <Text style={{ fontSize: 33, lineHeight: 40, color: '#161e29', fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
            Ton plan est prêt.
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
            Basé sur tes réponses, voici ce qu’on a préparé pour toi :
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
            <Text style={{ fontSize: 16, color: '#1f2b39', fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>🎯 Focus : {firstBlocker}</Text>
            <Text style={{ fontSize: 16, color: '#1f2b39', fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>⏱️ Rythme : {rhythm} par jour</Text>
            <Text style={{ fontSize: 16, color: '#1f2b39', fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>📈 Objectif : {mainGoal}</Text>
            <Text style={{ fontSize: 16, color: '#1f2b39', fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>🎸 Niveau : {level}</Text>
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
            {resultDelay(segment)}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: insets.bottom + 20 }}>
          <AnimatedNextButton
            onPress={() => {
              completeOnboarding?.();
              resetFlow?.();
              router.replace('/(tabs)');
            }}
            title="Commencer"
          />
        </View>
      </OnboardingContainer>
    </SafeAreaView>
  );
}
