import { router } from 'expo-router';

import { OnboardingMessageScreen } from '@/components/onboarding/OnboardingMessageScreen';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingIntroProblemScreen() {
  return (
    <OnboardingMessageScreen
      progress={getOnboardingProgress('intro_problem')}
      title="Tu t'entraînes, mais tu ne connais pas tes notes sur le manche."
      description="Trouver une note, improviser, suivre un morceau… ça demande une fluidité que peu de bassistes construisent vraiment."
      onBack={() => router.back()}
      onNext={() => router.push('/onboarding/intro-friction')}
    />
  );
}
