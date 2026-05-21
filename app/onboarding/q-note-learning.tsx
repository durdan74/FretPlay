import { router } from 'expo-router';

import { MultiChoiceQuestion } from '@/components/onboarding/MultiChoiceQuestion';
import { useNotation } from '@/contexts/notation-context';
import { useOnboardingFlow } from '@/contexts/onboarding-flow-context';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingNoteLearningScreen() {
  const { setNoteLearning } = useOnboardingFlow();
  const { t } = useNotation();
  const options = [
    t('onboardingNoteLearning0'),
    t('onboardingNoteLearning1'),
    t('onboardingNoteLearning2'),
    t('onboardingNoteLearning3'),
    t('onboardingNoteLearning4'),
  ] as const;

  return (
    <MultiChoiceQuestion
      title={t('onboardingNoteLearningTitle')}
      description={t('onboardingNoteLearningDescription')}
      options={options}
      progress={getOnboardingProgress('q_note_learning')}
      onBack={() => router.back()}
      onContinue={(indexes) => {
        setNoteLearning(indexes.map((i) => options[i] ?? '').filter(Boolean));
        router.push('/onboarding/q-goal');
      }}
    />
  );
}
