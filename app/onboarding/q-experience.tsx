import { router } from 'expo-router';

import { SingleChoiceQuestion } from '@/components/onboarding/SingleChoiceQuestion';
import { useNotation } from '@/contexts/notation-context';
import { useOnboardingFlow, type OnboardingSegment } from '@/contexts/onboarding-flow-context';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

export default function OnboardingExperienceScreen() {
  const { setExperience, setSegment } = useOnboardingFlow();
  const { t } = useNotation();
  const options = [
    t('onboardingExperience0'),
    t('onboardingExperience1'),
    t('onboardingExperience2'),
    t('onboardingExperience3'),
    t('onboardingExperience4'),
    t('onboardingExperience5'),
    t('onboardingExperience6'),
  ] as const;

  return (
    <SingleChoiceQuestion
      title={t('onboardingExperienceTitle')}
      description={t('onboardingExperienceDescription')}
      options={options}
      progress={getOnboardingProgress('q_experience')}
      onBack={() => router.back()}
      onSelect={(index) => {
        setExperience(options[index] ?? options[0]);
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
