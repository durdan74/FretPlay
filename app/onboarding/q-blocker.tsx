import { router } from 'expo-router';

import { MultiChoiceQuestion } from '@/components/onboarding/MultiChoiceQuestion';
import { useOnboardingFlow } from '@/contexts/onboarding-flow-context';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

const BLOCKERS_OPTIONS = [
  'Ça va trop vite',
  'Trop de choses à penser en même temps',
  "Je me concentre sur une main, l'autre suit mal",
  'Je connais la théorie, mais je cherche encore les notes',
  'Je manque de régularité',
  'Je perds mes moyens en condition réelle (jam/scène)',
] as const;

export default function OnboardingBlockerScreen() {
  const { setBlockers } = useOnboardingFlow();

  return (
    <MultiChoiceQuestion
      title="Qu’est-ce qui te bloque le plus quand tu joues ?"
      description="Choisis la difficulté principale qui te freine aujourd’hui."
      options={BLOCKERS_OPTIONS}
      progress={getOnboardingProgress('q_blocker')}
      onBack={() => router.back()}
      maxSelections={3}
      onContinue={(indexes) => {
        setBlockers(indexes.map((i) => BLOCKERS_OPTIONS[i] ?? '').filter(Boolean));
        router.push('/onboarding/q-note-learning');
      }}
    />
  );
}
