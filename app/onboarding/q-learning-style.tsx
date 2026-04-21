import { router } from 'expo-router';

import { SingleChoiceQuestion } from '@/components/onboarding/SingleChoiceQuestion';
import { useOnboardingFlow } from '@/contexts/onboarding-flow-context';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

const LEARNING_STYLE_OPTIONS = ['En cours / prof', 'Autodidacte', 'Les deux'] as const;

export default function OnboardingLearningStyleScreen() {
  const { setLearningStyle } = useOnboardingFlow();

  return (
    <SingleChoiceQuestion
      title="Tu apprends plutôt comment ?"
      description="Choisis la réponse qui correspond à ta pratique."
      options={LEARNING_STYLE_OPTIONS}
      progress={getOnboardingProgress('q_learning_style')}
      onBack={() => router.back()}
      onSelect={(index) => {
        setLearningStyle(LEARNING_STYLE_OPTIONS[index] ?? LEARNING_STYLE_OPTIONS[0]);
        router.push('/onboarding/q-daily-time');
      }}
    />
  );
}
