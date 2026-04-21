import { router } from 'expo-router';

import { SingleChoiceQuestion } from '@/components/onboarding/SingleChoiceQuestion';
import { useOnboardingFlow } from '@/contexts/onboarding-flow-context';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

const GOAL_OPTIONS = [
  'Progresser rapidement',
  'Jouer plus proprement',
  'Jouer sur scène',
  'Devenir pro',
  'M’amuser et rester régulier',
  'Consolider mes acquis',
] as const;

export default function OnboardingGoalScreen() {
  const { setGoal } = useOnboardingFlow();

  return (
    <SingleChoiceQuestion
      title="Quel est ton objectif principal ?"
      description="Choisis la réponse qui te correspond le plus."
      options={GOAL_OPTIONS}
      progress={getOnboardingProgress('q_goal')}
      onBack={() => router.back()}
      onSelect={(index) => {
        setGoal(GOAL_OPTIONS[index] ?? GOAL_OPTIONS[0]);
        router.push('/onboarding/q-learning-style');
      }}
    />
  );
}
