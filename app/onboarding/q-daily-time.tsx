import { router } from 'expo-router';

import { SingleChoiceQuestion } from '@/components/onboarding/SingleChoiceQuestion';
import { useOnboardingFlow } from '@/contexts/onboarding-flow-context';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

const DAILY_TIME_OPTIONS = ['5 min', '10 min', '15 min', '20+ min'] as const;

export default function OnboardingDailyTimeScreen() {
  const { setDailyTime } = useOnboardingFlow();

  return (
    <SingleChoiceQuestion
      title="De combien de temps disposes-tu par jour ?"
      description="Choisis un rythme réaliste pour ton plan."
      options={DAILY_TIME_OPTIONS}
      progress={getOnboardingProgress('q_daily_time')}
      onBack={() => router.back()}
      onSelect={(index) => {
        setDailyTime(DAILY_TIME_OPTIONS[index] ?? DAILY_TIME_OPTIONS[0]);
        router.push('/onboarding/proof-science');
      }}
    />
  );
}
