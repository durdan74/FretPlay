import { router } from 'expo-router';

import { MultiChoiceQuestion } from '@/components/onboarding/MultiChoiceQuestion';
import { useNotation } from '@/contexts/notation-context';
import { useOnboardingFlow } from '@/contexts/onboarding-flow-context';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingBlockerScreen() {
  const { setBlockers } = useOnboardingFlow();
  const { t } = useNotation();
  const options = [
    t('onboardingBlocker0'),
    t('onboardingBlocker1'),
    t('onboardingBlocker2'),
    t('onboardingBlocker3'),
    t('onboardingBlocker4'),
    t('onboardingBlocker5'),
  ] as const;

  return (
    <MultiChoiceQuestion
      title={t('onboardingBlockerTitle')}
      description={t('onboardingBlockerDescription')}
      options={options}
      progress={getOnboardingProgress('q_blocker')}
      onBack={() => router.back()}
      maxSelections={3}
      onContinue={(indexes) => {
        setBlockers(indexes.map((i) => options[i] ?? '').filter(Boolean));
        router.push('/onboarding/q-note-learning');
      }}
    />
  );
}
