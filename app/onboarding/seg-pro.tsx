import { router } from 'expo-router';

import { OnboardingMessageScreen } from '@/components/onboarding/OnboardingMessageScreen';
import { useNotation } from '@/contexts/notation-context';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingSegProScreen() {
  const { t } = useNotation();

  return (
    <OnboardingMessageScreen
      progress={getOnboardingProgress('seg_pro')}
      title={t('onboardingSegProTitle')}
      description={t('onboardingSegProBody')}
      imageSource={require('@/assets/images/super-francais.png')}
      imageHeight={240}
      imageContentFit="contain"
      onBack={() => router.back()}
      onNext={() => router.push('/onboarding/q-blocker')}
    />
  );
}
