import { router } from 'expo-router';

import { OnboardingMessageScreen } from '@/components/onboarding/OnboardingMessageScreen';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingIntroProblemScreen() {
  return (
    <OnboardingMessageScreen
      progress={getOnboardingProgress('intro_problem')}
      title="Tu joues, mais tu ne connais pas tes notes sur le manche."
      description="Je te rassures, tu es loin d'être le seul ! Beaucoup de bassistes ne connaissent pas leurs notes sur le manche. Et pourtant, c'est une compétence essentielle pour jouer du basse."
      onBack={() => router.back()}
      disableBack
      onNext={() => router.push('/onboarding/intro-friction')}
    />
  );
}
