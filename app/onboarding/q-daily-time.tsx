import { router } from 'expo-router';

import { SingleChoiceQuestion } from '@/components/onboarding/SingleChoiceQuestion';
import { useNotation } from '@/contexts/notation-context';
import { useOnboardingFlow } from '@/contexts/onboarding-flow-context';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingDailyTimeScreen() {
  const { setDailyTime } = useOnboardingFlow();
  const { t } = useNotation();
  const options = [
    t('onboardingPlan5Min'),
    t('onboardingPlan10Min'),
    t('onboardingPlan15Min'),
    t('onboardingPlan20Min'),
  ] as const;

  return (
    <SingleChoiceQuestion
      title={t('onboardingDailyTimeTitle')}
      description={t('onboardingDailyTimeDescription')}
      options={options}
      progress={getOnboardingProgress('q_daily_time')}
      onBack={() => router.back()}
      onSelect={(index) => {
        setDailyTime(options[index] ?? options[0]);
        router.push('/onboarding/proof-science');
      }}
    />
  );
}
