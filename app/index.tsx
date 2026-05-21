import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router } from 'expo-router';
import { Image } from 'expo-image';
import React from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingLanguageCombo } from '@/components/OnboardingLanguageCombo';
import { useNotation } from '@/contexts/notation-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

const LANDING_SLIDES = [
  { id: 'landing-1', titleKey: 'landingSlide1Title', descriptionKey: 'landingSlide1Description', icon: '🎸', imageSource: require('@/assets/images/basse-francais.png') },
  { id: 'landing-2', titleKey: 'landingSlide2Title', descriptionKey: 'landingSlide2Description', icon: '📈', imageSource: require('@/assets/images/mesure-progres-francais.png') },
  { id: 'landing-3', titleKey: 'landingSlide3Title', descriptionKey: 'landingSlide3Description', icon: '🎯', imageSource: require('@/assets/images/mini-jeux-francais.png') },
] as const;

const FORCE_PAYWALL_ON_RELOAD = __DEV__ && process.env.EXPO_PUBLIC_FORCE_PAYWALL_ON_RELOAD === 'true';

/**
 * Point d’entrée : après hydratation des paramètres, intro ou onglets.
 */
export default function RootIndex() {
  const { isHydrated, onboardingCompleted, t } = useNotation();
  const colorScheme = useColorScheme() ?? 'light';
  const bg = Colors[colorScheme].background;
  const scrollRef = React.useRef<ScrollView>(null);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      const next = currentIndex >= LANDING_SLIDES.length - 1 ? 0 : currentIndex + 1;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setCurrentIndex(next);
    }, 4200);
    return () => clearInterval(id);
  }, [currentIndex]);

  if (!isHydrated) {
    return <View style={{ flex: 1, backgroundColor: bg }} />;
  }

  if (FORCE_PAYWALL_ON_RELOAD) {
    return <Redirect href="/paywall" />;
  }

  if (onboardingCompleted) {
    return <Redirect href="/(tabs)" />;
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    scrollRef.current?.scrollTo({ x: width * index, animated: true });
  };

  return (
    <LinearGradient colors={['#f3f8ff', '#ffffff']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingTop: 10 }}>
          <View style={{ paddingHorizontal: 22, marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: 38,
                  lineHeight: 42,
                  letterSpacing: -1.1,
                  color: '#1c2430',
                  fontWeight: '800',
                }}
              >
                {t('homeAppName')}
              </Text>
              <OnboardingLanguageCombo />
            </View>
            <Text
              style={{
                marginTop: 8,
                color: '#5f6f83',
                fontSize: 16,
                lineHeight: 22,
              }}
            >
              {t('landingSubtitle')}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              scrollEventThrottle={16}
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                useNativeDriver: false,
              })}
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                setCurrentIndex(idx);
              }}
            >
              {LANDING_SLIDES.map((slide) => (
                <View key={slide.id} style={{ width, paddingHorizontal: 22 }}>
                  <View
                    style={{
                      borderRadius: 24,
                      borderWidth: 1,
                      borderColor: '#dce7f4',
                      backgroundColor: '#ffffff',
                      padding: 16,
                    }}
                  >
                    <View
                      style={{
                        height: 230,
                        borderRadius: 18,
                        backgroundColor: '#edf4ff',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 14,
                        overflow: 'hidden',
                      }}
                    >
                      {slide.imageSource ? (
                        <Image
                          source={slide.imageSource}
                          contentFit="cover"
                          style={{ width: '100%', height: '100%' }}
                        />
                      ) : (
                        <>
                          <Text style={{ fontSize: 48 }}>{slide.icon}</Text>
                          <Text style={{ color: '#6b7f99', marginTop: 8, fontSize: 13 }}>{t('photoPlaceholder')}</Text>
                        </>
                      )}
                    </View>
                    <Text style={{ fontSize: 27, lineHeight: 33, color: '#1c2430', fontWeight: '700' }}>
                      {t(slide.titleKey)}
                    </Text>
                    <Text style={{ marginTop: 8, color: '#5f6f83', fontSize: 15, lineHeight: 22 }}>
                      {t(slide.descriptionKey)}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
              {LANDING_SLIDES.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                const dotWidth = scrollX.interpolate({
                  inputRange,
                  outputRange: [8, 20, 8],
                  extrapolate: 'clamp',
                });
                const dotColor = scrollX.interpolate({
                  inputRange,
                  outputRange: ['#d7e6fb', '#2F80ED', '#d7e6fb'],
                  extrapolate: 'clamp',
                });

                return (
                  <TouchableOpacity key={i} onPress={() => goToSlide(i)}>
                    <Animated.View
                      style={{
                        width: dotWidth,
                        height: 8,
                        borderRadius: 8,
                        marginHorizontal: 4,
                        backgroundColor: dotColor,
                      }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={{ paddingHorizontal: 22, paddingTop: 10, paddingBottom: 14 }}>
            <Pressable
              onPress={() => router.push('/onboarding')}
              style={({ pressed }) => ({
                height: 56,
                borderRadius: 28,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#2F80ED',
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>{t('landingCta')}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
