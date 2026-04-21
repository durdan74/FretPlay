import { router } from 'expo-router';

import { OnboardingMessageScreen } from '@/components/onboarding/OnboardingMessageScreen';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingSegBeginnerScreen() {
  return (
    <OnboardingMessageScreen
      progress={getOnboardingProgress('seg_beginner')}
      title="Super ! Tu verras des progrès rapidement."
      description="Fretplay est pensé pour les débutants — tu vas poser des bases solides dès le départ, sans prendre de mauvaises habitudes."
      onBack={() => router.back()}
      onNext={() => router.push('/onboarding/q-blocker')}
    />
  );
}
