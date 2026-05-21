import { router } from 'expo-router';

import { SingleChoiceQuestion } from '@/components/onboarding/SingleChoiceQuestion';
import { useNotation } from '@/contexts/notation-context';
import { useOnboardingFlow } from '@/contexts/onboarding-flow-context';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingLearningStyleScreen() {
  const { setLearningStyle } = useOnboardingFlow();
  const { t } = useNotation();
  const options = [
    t('onboardingLearningStyle0'),
    t('onboardingLearningStyle1'),
    t('onboardingLearningStyle2'),
    t('onboardingLearningStyle3'),
  ] as const;

  return (
    <SingleChoiceQuestion
      title={t('onboardingLearningStyleTitle')}
      description={t('onboardingLearningStyleDescription')}
      options={options}
      progress={getOnboardingProgress('q_learning_style')}
      onBack={() => router.back()}
      onSelect={(index) => {
        setLearningStyle(options[index] ?? options[0]);
        router.push('/onboarding/q-daily-time');
      }}
    />
  );
}
