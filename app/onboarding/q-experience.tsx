import { router } from 'expo-router';

import { SingleChoiceQuestion } from '@/components/onboarding/SingleChoiceQuestion';
import { useOnboardingFlow, type OnboardingSegment } from '@/contexts/onboarding-flow-context';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

const EXPERIENCE_OPTIONS = [
  'Je viens de débuter',
  'Depuis quelques semaines',
  'Depuis moins de 6 mois',
  'Depuis 1 an',
  'Depuis quelques années',
  'Depuis une décennie',
  'Depuis toujours',
] as const;

export default function OnboardingExperienceScreen() {
  const { setExperience, setSegment } = useOnboardingFlow();

  return (
    <SingleChoiceQuestion
      title="Depuis combien de temps joues-tu de la basse ?"
      description="Choisis une réponse. On utilisera cette base pour la suite du parcours."
      options={EXPERIENCE_OPTIONS}
      progress={getOnboardingProgress('q_experience')}
      onBack={() => router.back()}
      onSelect={(index) => {
        setExperience(EXPERIENCE_OPTIONS[index] ?? EXPERIENCE_OPTIONS[0]);
        let segment: OnboardingSegment = 'Avancé';
        if (index <= 2) {
          segment = 'Débutant';
          setSegment(segment);
          router.push('/onboarding/seg-beginner');
          return;
        }
        if (index <= 4) {
          segment = 'Amateur';
          setSegment(segment);
          router.push('/onboarding/seg-amateur');
          return;
        }
        setSegment(segment);
        router.push('/onboarding/seg-pro');
      }}
    />
  );
}
