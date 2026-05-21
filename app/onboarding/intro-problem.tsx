import { router } from 'expo-router';

import { OnboardingMessageScreen } from '@/components/onboarding/OnboardingMessageScreen';
import { useNotation } from '@/contexts/notation-context';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingIntroProblemScreen() {
  const { t } = useNotation();

  return (
    <OnboardingMessageScreen
      progress={getOnboardingProgress('intro_problem')}
      title={t('onboardingIntroProblemTitle')}
      description={t('onboardingIntroProblemBody')}
      imageSource={require('@/assets/images/onboarding-basse-with-question.png')}
      imageAspectRatio={1544 / 886}
      onBack={() => router.back()}
      disableBack
      onNext={() => router.push('/onboarding/intro-friction')}
    />
  );
}
