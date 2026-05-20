import { Manrope_400Regular, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedNextButton } from '@/components/onboarding/AnimatedNextButton';
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { useOnboardingFlow } from '@/contexts/onboarding-flow-context';
import { getOnboardingProgress } from '@/utils/onboardingProgress';

type Testimonial = {
  name: string;
  handle: string;
  avatarLabel: string;
  text: string;
};

const BEGINNER_TESTIMONIALS: Testimonial[] = [
  {
    name: 'Thomas',
    handle: '@thomasbass',
    avatarLabel: 'T',
    text: "J'ai enfin arrêté de chercher mes notes sur le manche. Mes morceaux passent beaucoup plus proprement.",
  },
  {
    name: 'Lina',
    handle: '@linagroove',
    avatarLabel: 'L',
    text: 'En 3 semaines, je me sens enfin fluide sur les positions de base. Le format court est parfait.',
  },
  {
    name: 'Nico',
    handle: '@nico4strings',
    avatarLabel: 'N',
    text: "Je pensais stagner, mais le plan est clair et motivant. J'avance chaque semaine.",
  },
];

const AMATEUR_TESTIMONIALS: Testimonial[] = [
  {
    name: 'Léa',
    handle: '@lealowend',
    avatarLabel: 'L',
    text: 'Mes sessions de basse sont 10x plus efficaces depuis. Je progresse sur des techniques que je bloquais.',
  },
  {
    name: 'Max',
    handle: '@maxgroove',
    avatarLabel: 'M',
    text: "L'app m'a aidé à passer un vrai cap en précision et en vitesse sur le manche.",
  },
  {
    name: 'Romain',
    handle: '@romainbass',
    avatarLabel: 'R',
    text: 'Le suivi quotidien fait la différence. Je vois des progrès concrets chaque mois.',
  },
];

const ADVANCED_TESTIMONIALS: Testimonial[] = [
  {
    name: 'Clara',
    handle: '@clarafunk',
    avatarLabel: 'C',
    text: "J'utilise FretPlay pour garder mes bases solides. C'est devenu ma routine d'entretien.",
  },
  {
    name: 'Yann',
    handle: '@yannsession',
    avatarLabel: 'Y',
    text: "Très bon pour rester précis et rapide. La structure m'évite de laisser des lacunes s'installer.",
  },
  {
    name: 'Bastien',
    handle: '@bastbass',
    avatarLabel: 'B',
    text: "Même avec de l'expérience, c'est un excellent rappel ciblé. Super efficace.",
  },
];

function TestimonialCard({ item, fontsLoaded }: { item: Testimonial; fontsLoaded: boolean }) {
  return (
    <LinearGradient
      colors={['#f8fbff', '#edf4ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#dce7f4',
        marginBottom: 12,
      }}
    >
      <View style={{ paddingHorizontal: 14, paddingVertical: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#d8e8ff',
              marginRight: 10,
            }}
          >
            <Text style={{ fontSize: 15, color: '#24508b', fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>{item.avatarLabel}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, color: '#1f2b39', fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>{item.name}</Text>
            <Text style={{ fontSize: 12, color: '#6a7f9e', fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined }}>{item.handle}</Text>
          </View>
          <Text style={{ fontSize: 14, color: '#2f80ed' }}>★★★★★</Text>
        </View>
        <Text style={{ fontSize: 15, lineHeight: 22, color: '#1f2b39', fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined }}>
          {item.text}
        </Text>
      </View>
    </LinearGradient>
  );
}

export default function OnboardingSocialProofScreen() {
  const insets = useSafeAreaInsets();
  const { segment } = useOnboardingFlow();
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_700Bold,
  });
  const testimonials = React.useMemo(() => {
    if (segment === 'Débutant') return BEGINNER_TESTIMONIALS;
    if (segment === 'Amateur') return AMATEUR_TESTIMONIALS;
    return ADVANCED_TESTIMONIALS;
  }, [segment]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'bottom']}>
      <OnboardingContainer>
        <View style={{ flex: 1, paddingTop: 20 }}>
          <View style={{ paddingHorizontal: 20 }}>
            <OnboardingHeader progress={getOnboardingProgress('social_proof')} onBack={() => router.back()} />

            <Text
              style={{
                fontSize: 29,
                lineHeight: 35,
                color: '#161e29',
                fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined,
              }}
            >
              Rejoins des milliers de bassistes comme toi sur FretPlay !
            </Text>

            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                lineHeight: 23,
                color: '#5f6f83',
                fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined,
                marginBottom: 12,
              }}
            >
              96% des utilisateurs réguliers voient une progression mesurable en 3 semaines.
            </Text>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 120 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {testimonials.map((item) => (
              <TestimonialCard key={item.handle} item={item} fontsLoaded={fontsLoaded} />
            ))}
          </ScrollView>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 }}>
          <AnimatedNextButton onPress={() => router.push('/onboarding/loading-plan')} title="Voir mon plan" />
        </View>
      </OnboardingContainer>
    </SafeAreaView>
  );
}
