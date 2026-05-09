import { Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import { router } from 'expo-router';
import React from 'react';
import { Animated, BackHandler, Easing, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer';

const STEPS = [
  'Analyse de ton profil...',
  'Calibration de la difficulté...',
  'Sélection des exercices adaptés...',
  'Création de ton plan personnalisé...',
] as const;
const PROGRESS_DURATION_MS = 6000;
const MESSAGE_DURATION_MS = 1500;

export default function OnboardingLoadingPlanScreen() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  const [index, setIndex] = React.useState(0);
  const progressAnim = React.useRef(new Animated.Value(0)).current;
  const messageOpacity = React.useRef(new Animated.Value(1)).current;
  const activeDotScale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: PROGRESS_DURATION_MS,
      easing: Easing.bezier(0.0, 0.0, 0.58, 1.0),
      useNativeDriver: false,
    }).start();

    const done = setTimeout(() => {
      router.replace('/onboarding/plan-summary');
    }, PROGRESS_DURATION_MS);
    return () => clearTimeout(done);
  }, [progressAnim]);

  React.useEffect(() => {
    if (index >= STEPS.length - 1) return;
    const timer = setTimeout(() => {
      Animated.timing(messageOpacity, {
        toValue: 0,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setIndex((v) => Math.min(v + 1, STEPS.length - 1));
        Animated.timing(messageOpacity, {
          toValue: 1,
          duration: 150,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }).start();
      });
    }, MESSAGE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [index, messageOpacity]);

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(activeDotScale, {
          toValue: 1.15,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(activeDotScale, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [activeDotScale]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'bottom']}>
      <OnboardingContainer>
        <LinearGradient
          colors={['#f4f8ff', '#ffffff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              paddingHorizontal: 22,
              paddingVertical: 28,
              gap: 36,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ alignItems: 'center', gap: 10 }}>
              <Text
                style={{
                  fontSize: 13,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                    color: '#2f80ed',
                  fontFamily: fontsLoaded ? 'Manrope_600SemiBold' : undefined,
                }}
              >
                FretPlay
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  lineHeight: 34,
                  color: '#1b2636',
                  textAlign: 'center',
                  fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined,
                }}
              >
                Préparation de ton plan
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 21,
                  color: '#5f6f83',
                  textAlign: 'center',
                  maxWidth: 340,
                  fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined,
                }}
              >
                On personnalise ton parcours pour te faire gagner du temps dès les premières sessions.
              </Text>
            </View>

            <View
              style={{
                borderRadius: 26,
                padding: 22,
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#dce7f4',
                gap: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  letterSpacing: 1.1,
                  textTransform: 'uppercase',
                  color: '#2f80ed',
                  fontFamily: fontsLoaded ? 'Manrope_600SemiBold' : undefined,
                }}
              >
                Analyse en cours
              </Text>

              <Animated.Text
                style={{
                  fontSize: 20,
                  lineHeight: 27,
                  color: '#1c2430',
                  opacity: messageOpacity,
                  fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined,
                }}
              >
                {STEPS[index]}
              </Animated.Text>

              <View
                style={{
                  height: 7,
                  borderRadius: 999,
                  overflow: 'hidden',
                  backgroundColor: '#e5edf8',
                }}
              >
                <Animated.View
                  style={{
                    height: '100%',
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  }}
                >
                  <LinearGradient
                    colors={['#2f80ed', '#56a6ff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ flex: 1, borderRadius: 999 }}
                  />
                </Animated.View>
              </View>

              <View style={{ gap: 12 }}>
                {STEPS.map((step, idx) => {
                  const isActive = idx === index;
                  const isDone = idx < index;
                  return (
                    <View key={step} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      {isActive ? (
                        <Animated.View
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: '#56a6ff',
                            transform: [{ scale: activeDotScale }],
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: isDone ? '#2f80ed' : '#cfdced',
                          }}
                        />
                      )}
                      <Text
                        style={{
                          flex: 1,
                          fontSize: 14,
                          lineHeight: 20,
                          color: isActive ? '#1c2430' : isDone ? '#355172' : '#7f90a6',
                          fontFamily: fontsLoaded
                            ? isActive
                              ? 'Manrope_600SemiBold'
                              : 'Manrope_400Regular'
                            : undefined,
                        }}
                      >
                        {step}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </OnboardingContainer>
    </SafeAreaView>
  );
}
