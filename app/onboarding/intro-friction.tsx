import { router } from 'expo-router';

import { OnboardingMessageScreen } from '@/components/onboarding/OnboardingMessageScreen';
import { useNotation } from '@/contexts/notation-context';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingIntroFrictionScreen() {
  const { t } = useNotation();

  return (
    <OnboardingMessageScreen
      progress={getOnboardingProgress('intro_friction')}
      title={t('onboardingIntroFrictionTitle')}
      description={t('onboardingIntroFrictionBody')}
      imageSource={require('@/assets/images/apprentissage-complique-francais.png')}
      imageAspectRatio={1528 / 1680}
      onBack={() => router.back()}
      onNext={() => router.push('/onboarding/intro-solution')}
    />
  );
}
