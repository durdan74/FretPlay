import { router } from 'expo-router';

import { OnboardingMessageScreen } from '@/components/onboarding/OnboardingMessageScreen';
import { useNotation } from '@/contexts/notation-context';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingIntroSolutionScreen() {
  const { t } = useNotation();

  return (
    <OnboardingMessageScreen
      progress={getOnboardingProgress('intro_solution')}
      title={t('onboardingIntroSolutionTitle')}
      description={t('onboardingIntroSolutionBody')}
      imageSource={require('@/assets/images/avantages-desavantages-francais.png')}
      imageAspectRatio={1360 / 1263}
      onBack={() => router.back()}
      onNext={() => router.push('/onboarding/q-experience')}
    />
  );
}
