import { router } from 'expo-router';

import { OnboardingMessageScreen } from '@/components/onboarding/OnboardingMessageScreen';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingIntroFrictionScreen() {
  return (
    <OnboardingMessageScreen
      progress={getOnboardingProgress('intro_friction')}
      title="Le vrai blocage, ce n’est pas toi."
      description="Trop d'infos à penser en même temps, coordination des deux mains, notes qu'on cherche au lieu de les jouer. Apprendre ses notes parait trop fastidieux et on n'a du mal à les retenir. Résultat : on stagne, le temps passe et on ne connait toujours pas ses notes."
      imageSource={require('@/assets/images/apprentissage-complique-francais.png')}
      imageAspectRatio={1528 / 1680}
      onBack={() => router.back()}
      onNext={() => router.push('/onboarding/intro-solution')}
    />
  );
}
