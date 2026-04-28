import { router } from 'expo-router';

import { OnboardingMessageScreen } from '@/components/onboarding/OnboardingMessageScreen';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingIntroSolutionScreen() {
  return (
    <OnboardingMessageScreen
      progress={getOnboardingProgress('intro_solution')}
      title="FretPlay, c'est quelques minutes. Pas plus."
      description="Des mini-jeux pensés pour ancrer les notes du manche dans ta mémoire, avec un feedback immédiat à chaque réponse. Les notes deviennent naturelles et tu progresseras vite."
      onBack={() => router.back()}
      onNext={() => router.push('/onboarding/q-experience')}
    />
  );
}
