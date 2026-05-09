import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Animated, Dimensions, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNotation } from '@/contexts/notation-context';

const { width } = Dimensions.get('window');

const LANDING_SLIDES = [
  {
    id: 'landing-1',
    title: 'Maîtrise le manche plus vite',
    description: 'Des exercices courts pour ancre r les notes et jouer avec plus de confiance.',
    icon: '🎸',
  },
  {
    id: 'landing-2',
    title: 'Mesure tes vrais progrès',
    description: 'Suis ta régularité et améliore ton taux de réussite à chaque session.',
    icon: '📈',
  },
  {
    id: 'landing-3',
    title: 'des mini-jeux ultra efficaces',
    description: 'Travaille à la fois le repérage visuel et la mémoire musculaire du manche.',
    icon: '🎯',
  },
] as const;

export default function LandingScreen() {
  const { t } = useNotation();
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

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    scrollRef.current?.scrollTo({ x: width * index, animated: true });
  };

  return (
    <LinearGradient colors={['#f3f8ff', '#ffffff']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingTop: 10 }}>
          <View style={{ paddingHorizontal: 22, marginBottom: 14 }}>
            <Text
              style={{
                fontSize: 38,
                lineHeight: 42,
                letterSpacing: -1.1,
                color: '#1c2430',
                fontWeight: '800',
              }}
            >
              {t('homeAppName')}
            </Text>
            <Text
              style={{
                marginTop: 8,
                color: '#5f6f83',
                fontSize: 16,
                lineHeight: 22,
              }}
            >
              L’app d’entraînement basse pour connaitre les notes sur le manche instantanément.
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
                      }}
                    >
                      <Text style={{ fontSize: 48 }}>{slide.icon}</Text>
                      <Text style={{ color: '#6b7f99', marginTop: 8, fontSize: 13 }}>Photo placeholder</Text>
                    </View>
                    <Text style={{ fontSize: 27, lineHeight: 33, color: '#1c2430', fontWeight: '700' }}>
                      {slide.title}
                    </Text>
                    <Text style={{ marginTop: 8, color: '#5f6f83', fontSize: 15, lineHeight: 22 }}>
                      {slide.description}
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
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>Commencer</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
