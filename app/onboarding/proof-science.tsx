import { NativeModulesProxy } from 'expo-modules-core';
import { router } from 'expo-router';

import { OnboardingMessageScreen } from '@/components/onboarding/OnboardingMessageScreen';
import { useNotation } from '@/contexts/notation-context';
import { useOnboardingFlow } from '@/contexts/onboarding-flow-context';
import { fillTemplate } from '@/lib/i18n/template';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

function displayDailyMinutes(value: string | null): string {
  if (!value) return '10';
  if (value.includes('20+')) return '20+';
  const match = value.match(/\d+/);
  return match?.[0] ?? '10';
}

export default function OnboardingProofScienceScreen() {
  const { dailyTime } = useOnboardingFlow();
  const { t } = useNotation();
  const minutes = displayDailyMinutes(dailyTime);

  const handleContinue = async () => {
    try {
      if (NativeModulesProxy.ExpoStoreReview) {
        const StoreReview = await import('expo-store-review');
        if (await StoreReview.hasAction()) {
          await StoreReview.requestReview();
        }
      }
    } catch {
      // The native module is unavailable until the dev-client is rebuilt.
    } finally {
      router.push('/onboarding/social-proof');
    }
  };

  return (
    <OnboardingMessageScreen
      progress={getOnboardingProgress('proof_science')}
      title={fillTemplate(t('onboardingProofTitle'), { minutes })}
      description={t('onboardingProofBody')}
      imageSource={require('@/assets/images/progression-francais.png')}
      imageAspectRatio={1536 / 1024}
      onBack={() => router.back()}
      onNext={handleContinue}
    />
  );
}
