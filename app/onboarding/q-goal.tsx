import { router } from 'expo-router';

import { SingleChoiceQuestion } from '@/components/onboarding/SingleChoiceQuestion';
import { useNotation } from '@/contexts/notation-context';
import { useOnboardingFlow } from '@/contexts/onboarding-flow-context';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingGoalScreen() {
  const { setGoal } = useOnboardingFlow();
  const { t } = useNotation();
  const options = [
    t('onboardingGoal0'),
    t('onboardingGoal1'),
    t('onboardingGoal2'),
    t('onboardingGoal3'),
    t('onboardingGoal4'),
    t('onboardingGoal5'),
  ] as const;

  return (
    <SingleChoiceQuestion
      title={t('onboardingGoalTitle')}
      description={t('onboardingGoalDescription')}
      options={options}
      progress={getOnboardingProgress('q_goal')}
      onBack={() => router.back()}
      onSelect={(index) => {
        setGoal(options[index] ?? options[0]);
        router.push('/onboarding/q-learning-style');
      }}
    />
  );
}
