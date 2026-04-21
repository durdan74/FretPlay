import { router } from 'expo-router';

import { MultiChoiceQuestion } from '@/components/onboarding/MultiChoiceQuestion';
import { useOnboardingFlow } from '@/contexts/onboarding-flow-context';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

const NOTE_LEARNING_OPTIONS = [
  'Je ne les travaille pas vraiment',
  'Je joue des morceaux en espérant les retenir',
  'Je fais des exercices de temps en temps',
  'J’ai une méthode régulière',
  'Autre',
] as const;

export default function OnboardingNoteLearningScreen() {
  const { setNoteLearning } = useOnboardingFlow();

  return (
    <MultiChoiceQuestion
      title="Comment apprends-tu tes notes aujourd’hui ?"
      description="Tu peux sélectionner plusieurs options."
      options={NOTE_LEARNING_OPTIONS}
      progress={getOnboardingProgress('q_note_learning')}
      onBack={() => router.back()}
      onContinue={(indexes) => {
        setNoteLearning(indexes.map((i) => NOTE_LEARNING_OPTIONS[i] ?? '').filter(Boolean));
        router.push('/onboarding/q-goal');
      }}
    />
  );
}
