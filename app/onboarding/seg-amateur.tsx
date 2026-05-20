import { router } from 'expo-router';

import { OnboardingMessageScreen } from '@/components/onboarding/OnboardingMessageScreen';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingSegAmateurScreen() {
  return (
    <OnboardingMessageScreen
      progress={getOnboardingProgress('seg_amateur')}
      title="Super ! C'est le moment idéal pour structurer ce que tu sais déjà."
      description="C'est le moment idéal pour structurer ce que tu sais déjà et franchir le cap qui te sépare du niveau supérieur."
      imageSource={require('@/assets/images/super-francais.png')}
      imageHeight={240}
      imageContentFit="contain"
      onBack={() => router.back()}
      onNext={() => router.push('/onboarding/q-blocker')}
    />
  );
}
