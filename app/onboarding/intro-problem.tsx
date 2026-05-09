import { router } from 'expo-router';

import { OnboardingMessageScreen } from '@/components/onboarding/OnboardingMessageScreen';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingIntroProblemScreen() {
  return (
    <OnboardingMessageScreen
      progress={getOnboardingProgress('intro_problem')}
      title="Tu joues, mais tu ne connais pas tes notes sur le manche."
      description="Je te rassures, tu es loin d'être le seul ! Beaucoup de bassistes ne connaissent pas leurs notes sur le manche. Et pourtant, c'est une compétence essentielle pour jouer de la basse."
      imageSource={require('@/assets/images/onboarding-basse-with-question.png')}
      imageAspectRatio={1544 / 886}
      onBack={() => router.back()}
      disableBack
      onNext={() => router.push('/onboarding/intro-friction')}
    />
  );
}
