import { router } from 'expo-router';

import { OnboardingMessageScreen } from '@/components/onboarding/OnboardingMessageScreen';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingSegProScreen() {
  return (
    <OnboardingMessageScreen
      progress={getOnboardingProgress('seg_pro')}
      title="Tu combleras tes lacunes en moins de 45 jours."
      description="Fretplay est parfait pour revisiter tes fondamentaux, combler les petits manques et garder une pratique régulière."
      onBack={() => router.back()}
      onNext={() => router.push('/onboarding/q-blocker')}
    />
  );
}
