import { router } from 'expo-router';

import { OnboardingMessageScreen } from '@/components/onboarding/OnboardingMessageScreen';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingIntroSolutionScreen() {
  return (
    <OnboardingMessageScreen
      progress={getOnboardingProgress('intro_solution')}
      title="FretPlay, c'est quelques minutes. Pas plus."
      description="Des mini-jeux pensés pour ancrer les notes du manche dans ta mémoire, avec un feedback immédiat à chaque réponse. Les notes deviennent naturelles et tu progresseras vite."
      imageSource={require('@/assets/images/avantages-desavantages-francais.png')}
      imageAspectRatio={1360 / 1263}
      onBack={() => router.back()}
      onNext={() => router.push('/onboarding/q-experience')}
    />
  );
}
