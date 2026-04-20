import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  Image,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingLanguageCombo } from '@/components/OnboardingLanguageCombo';
import { GAME_ACCENT, GAME_FOUND, GAME_MISSED } from '@/constants/gameScreen';
import { Colors } from '@/constants/theme';
import { useNotation } from '@/contexts/notation-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { TranslationKey } from '@/lib/i18n/strings';

/** Indices : partie 1 [0..2], partie 2 [3..8], partie 3 [9..11], essai gratuit [12]. */
const TOTAL_SLIDES = 13;
const TRIAL_INDEX = 12;

const Q1_OPTION_KEYS: TranslationKey[] = ['onboardingQ1o0', 'onboardingQ1o1', 'onboardingQ1o2', 'onboardingQ1o3'];
const Q2_OPTION_KEYS: TranslationKey[] = ['onboardingQ2o0', 'onboardingQ2o1', 'onboardingQ2o2', 'onboardingQ2o3'];

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

function IlluBox({
  children,
  caption,
  borderColor,
  bg,
}: {
  children: React.ReactNode;
  caption?: string;
  borderColor: string;
  bg: string;
}) {
  return (
    <View style={{ alignItems: 'center', marginVertical: 12 }}>
      <View
        style={{
          width: '100%',
          maxWidth: 320,
          minHeight: Math.min(windowHeight * 0.26, 220),
          borderRadius: 14,
          borderWidth: 1,
          borderColor,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 12,
        }}
      >
        {children}
      </View>
      {caption ? (
        <Text style={{ marginTop: 8, fontSize: 12, color: borderColor, fontStyle: 'italic' }}>{caption}</Text>
      ) : null}
    </View>
  );
}

export default function OnboardingScreen() {
  const { t, completeOnboarding, notation } = useNotation();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [slideIndex, setSlideIndex] = useState(0);

  const [q1Selected, setQ1Selected] = useState<Set<number>>(() => new Set());
  const [q2Selected, setQ2Selected] = useState<number | null>(null);

  const pageBg = colorScheme === 'dark' ? '#1a1816' : '#fff7f0';
  const titleColor = palette.text;
  const bodyColor = colorScheme === 'dark' ? '#a8a29e' : '#57534e';
  const accent = GAME_ACCENT;
  const illuBorder = colorScheme === 'dark' ? '#52525b' : '#d6d3d1';
  const illuBg = colorScheme === 'dark' ? '#27272a' : '#fafaf9';
  const chipBorder = colorScheme === 'dark' ? '#52525b' : '#cbd5e1';
  const chipBg = colorScheme === 'dark' ? '#3f3f46' : '#f1f5f9';

  const goToSlide = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_SLIDES - 1, i));
    setSlideIndex(clamped);
    scrollRef.current?.scrollTo({ x: windowWidth * clamped, animated: true });
  }, []);

  const slideIndexRef = useRef(slideIndex);
  slideIndexRef.current = slideIndex;

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        const idx = slideIndexRef.current;
        if (idx > 0) {
          goToSlide(idx - 1);
          return true;
        }
        return true;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [goToSlide]),
  );

  const onMomentumScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    setSlideIndex(Math.round(x / Math.max(1, windowWidth)));
  }, []);

  const onContinuePress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (slideIndex >= TRIAL_INDEX) return;
    if (slideIndex < TOTAL_SLIDES - 1) {
      goToSlide(slideIndex + 1);
    }
  }, [goToSlide, slideIndex]);

  const onTrialOk = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    completeOnboarding();
    router.replace('/(tabs)');
  }, [completeOnboarding]);

  const toggleQ1 = useCallback((idx: number) => {
    setQ1Selected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }, []);

  const summaryLines = useMemo(() => {
    const levelPart =
      [...q1Selected].sort().map((i) => t(Q1_OPTION_KEYS[i]!)).join(', ') || t('onboardingSummaryEmpty');
    const timePart = q2Selected !== null ? t(Q2_OPTION_KEYS[q2Selected]!) : t('onboardingSummaryEmpty');
    return { levelPart, timePart };
  }, [q1Selected, q2Selected, t]);

  const renderSlide = (i: number) => {
    const pad = { width: windowWidth, paddingHorizontal: 20, paddingTop: 6, flex: 1 };

    if (i === 0) {
      return (
        <View key={i} style={pad}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{ paddingBottom: 16, flexGrow: 1 }}
          >
            <Text style={{ fontSize: 26, fontWeight: '700', color: titleColor, textAlign: 'center', marginBottom: 12 }}>
              {t('onboardingP1s1Title')}
            </Text>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                color: bodyColor,
                textAlign: 'center',
                marginBottom: 14,
              }}
            >
              {t('onboardingP1s1Body')}
            </Text>
            <View
              style={{
                marginTop: 40,
                width: '100%',
                maxWidth: 400,
                alignSelf: 'center',
                height: Math.min(windowHeight * 0.32, 280),
                borderRadius: 16,
                overflow: 'hidden',
                backgroundColor: illuBg,
              }}
            >
              <Image
                source={require('../assets/images/onboarding/welcome-neck.png')}
                resizeMode="cover"
                style={{ width: '100%', height: '100%' }}
                accessibilityIgnoresInvertColors
              />
            </View>
          </ScrollView>
        </View>
      );
    }
    if (i === 1) {
      return (
        <View key={i} style={pad}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: titleColor, textAlign: 'center', marginBottom: 12 }}>
            {t('onboardingP1s2Title')}
          </Text>
          <IlluBox borderColor={illuBorder} bg={illuBg} caption={t('onboardingIlluPlaceholder')}>
            <MaterialCommunityIcons name="guitar-electric" size={88} color={accent} />
          </IlluBox>
          <Text style={{ fontSize: 15, lineHeight: 22, color: bodyColor, textAlign: 'center' }}>{t('onboardingP1s2Body')}</Text>
        </View>
      );
    }
    if (i === 2) {
      return (
        <View key={i} style={pad}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: titleColor, textAlign: 'center', marginBottom: 12 }}>
            {t('onboardingP1s3Title')}
          </Text>
          <Text style={{ fontSize: 15, lineHeight: 22, color: bodyColor, textAlign: 'center' }}>{t('onboardingP1s3Body')}</Text>
        </View>
      );
    }
    if (i === 3) {
      return (
        <View key={i} style={pad}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: titleColor, textAlign: 'center', marginBottom: 10 }}>
            {t('onboardingP2s1Title')}
          </Text>
          <IlluBox borderColor={illuBorder} bg={illuBg} caption={t('onboardingIlluPlaceholder')}>
            <Text style={{ fontSize: 42 }}>🎸</Text>
            <Text style={{ marginTop: 8, fontWeight: '700', color: titleColor }}>{t('gameNameNeck')}</Text>
          </IlluBox>
          <Text style={{ fontSize: 15, lineHeight: 22, color: bodyColor, textAlign: 'center' }}>{t('onboardingP2s1Body')}</Text>
        </View>
      );
    }
    if (i === 4) {
      return (
        <View key={i} style={pad}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: titleColor, textAlign: 'center', marginBottom: 10 }}>
            {t('onboardingP2s2Title')}
          </Text>
          <IlluBox borderColor={illuBorder} bg={illuBg} caption={t('onboardingIlluPlaceholder')}>
            <View style={{ width: '92%', height: 100, borderRadius: 8, backgroundColor: '#d2a679', position: 'relative' }}>
              <View
                style={{
                  position: 'absolute',
                  left: '42%',
                  top: '28%',
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  borderWidth: 3,
                  borderColor: GAME_FOUND,
                  backgroundColor: 'rgba(34,197,94,0.25)',
                }}
              />
              <Text
                style={{
                  position: 'absolute',
                  top: 6,
                  alignSelf: 'center',
                  fontWeight: '800',
                  color: '#1c1917',
                  fontSize: 16,
                }}
              >
                {notation === 'european' ? 'La' : 'A'}
              </Text>
            </View>
          </IlluBox>
          <Text style={{ fontSize: 15, lineHeight: 22, color: bodyColor, textAlign: 'center' }}>{t('onboardingP2s2Body')}</Text>
        </View>
      );
    }
    if (i === 5) {
      return (
        <View key={i} style={pad}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: titleColor, textAlign: 'center', marginBottom: 10 }}>
            {t('onboardingP2s3Title')}
          </Text>
          <IlluBox borderColor={illuBorder} bg={illuBg} caption={t('onboardingIlluPlaceholder')}>
            <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
              <View style={{ alignItems: 'center' }}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    borderWidth: 3,
                    borderColor: GAME_FOUND,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 22, fontWeight: '800', color: GAME_FOUND }}>7</Text>
                </View>
                <Text style={{ marginTop: 6, fontSize: 12, fontWeight: '600', color: bodyColor }}>{t('gameFound')}</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    borderWidth: 3,
                    borderColor: GAME_MISSED,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 22, fontWeight: '800', color: GAME_MISSED }}>3</Text>
                </View>
                <Text style={{ marginTop: 6, fontSize: 12, fontWeight: '600', color: bodyColor }}>{t('gameMissed')}</Text>
              </View>
            </View>
          </IlluBox>
          <Text style={{ fontSize: 15, lineHeight: 22, color: bodyColor, textAlign: 'center' }}>{t('onboardingP2s3Body')}</Text>
        </View>
      );
    }
    if (i === 6) {
      return (
        <View key={i} style={pad}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: titleColor, textAlign: 'center', marginBottom: 10 }}>
            {t('onboardingP2s4Title')}
          </Text>
          <IlluBox borderColor={illuBorder} bg={illuBg} caption={t('onboardingIlluPlaceholder')}>
            <Text style={{ fontSize: 42 }}>🎯</Text>
            <Text style={{ marginTop: 8, fontWeight: '700', color: titleColor }}>{t('gameNameFindCase')}</Text>
          </IlluBox>
          <Text style={{ fontSize: 15, lineHeight: 22, color: bodyColor, textAlign: 'center' }}>{t('onboardingP2s4Body')}</Text>
        </View>
      );
    }
    if (i === 7) {
      return (
        <View key={i} style={pad}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: titleColor, textAlign: 'center', marginBottom: 10 }}>
            {t('onboardingP2s5Title')}
          </Text>
          <IlluBox borderColor={illuBorder} bg={illuBg} caption={t('onboardingIlluPlaceholder')}>
            <View style={{ width: '90%', height: 72, borderRadius: 8, backgroundColor: '#d2a679', marginBottom: 10 }} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {(notation === 'european' ? ['Sol', 'Ré', 'Fa', 'La', 'Si'] : ['G', 'D', 'F', 'A', 'B']).map((n) => (
                <View
                  key={n}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                    borderRadius: 10,
                    backgroundColor: n === (notation === 'european' ? 'Ré' : 'D') ? GAME_FOUND : chipBg,
                    borderWidth: 1,
                    borderColor: n === (notation === 'european' ? 'Ré' : 'D') ? GAME_FOUND : chipBorder,
                  }}
                >
                  <Text style={{ fontWeight: '700', color: titleColor }}>{n}</Text>
                </View>
              ))}
            </View>
          </IlluBox>
          <Text style={{ fontSize: 15, lineHeight: 22, color: bodyColor, textAlign: 'center' }}>{t('onboardingP2s5Body')}</Text>
        </View>
      );
    }
    if (i === 8) {
      return (
        <View key={i} style={pad}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: titleColor, textAlign: 'center', marginBottom: 12 }}>
            {t('onboardingP2s6Title')}
          </Text>
          <Text style={{ fontSize: 15, lineHeight: 22, color: bodyColor, textAlign: 'center' }}>{t('onboardingP2s6Body')}</Text>
        </View>
      );
    }
    if (i === 9) {
      return (
        <View key={i} style={[pad, { paddingBottom: 8 }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: titleColor, textAlign: 'center', marginBottom: 16 }}>
              {t('onboardingQ1Title')}
            </Text>
            {Q1_OPTION_KEYS.map((key, idx) => {
              const on = q1Selected.has(idx);
              return (
                <Pressable
                  key={key}
                  onPress={() => toggleQ1(idx)}
                  style={{
                    marginBottom: 10,
                    paddingVertical: 14,
                    paddingHorizontal: 14,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: on ? accent : chipBorder,
                    backgroundColor: on ? `${accent}22` : chipBg,
                  }}
                >
                  <Text style={{ fontSize: 15, color: titleColor, fontWeight: on ? '700' : '500' }}>{t(key)}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      );
    }
    if (i === 10) {
      return (
        <View key={i} style={[pad, { paddingBottom: 8 }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: titleColor, textAlign: 'center', marginBottom: 16 }}>
              {t('onboardingQ2Title')}
            </Text>
            {Q2_OPTION_KEYS.map((key, idx) => {
              const on = q2Selected === idx;
              return (
                <Pressable
                  key={key}
                  onPress={() => setQ2Selected(idx)}
                  style={{
                    marginBottom: 10,
                    paddingVertical: 14,
                    paddingHorizontal: 14,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: on ? accent : chipBorder,
                    backgroundColor: on ? `${accent}22` : chipBg,
                  }}
                >
                  <Text style={{ fontSize: 15, color: titleColor, fontWeight: on ? '700' : '500' }}>{t(key)}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      );
    }
    if (i === 11) {
      return (
        <View key={i} style={pad}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: titleColor, textAlign: 'center', marginBottom: 16 }}>
            {t('onboardingSummaryTitle')}
          </Text>
          <View style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: bodyColor, marginBottom: 6 }}>
              {t('onboardingSummaryLevelLine')}
            </Text>
            <Text style={{ fontSize: 15, lineHeight: 22, color: titleColor }}>{summaryLines.levelPart}</Text>
          </View>
          <View style={{ marginBottom: 18 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: bodyColor, marginBottom: 6 }}>
              {t('onboardingSummaryTimeLine')}
            </Text>
            <Text style={{ fontSize: 15, lineHeight: 22, color: titleColor }}>{summaryLines.timePart}</Text>
          </View>
          <Text style={{ fontSize: 14, lineHeight: 21, color: bodyColor, textAlign: 'center', fontStyle: 'italic' }}>
            {t('onboardingSummaryPlaceholder')}
          </Text>
        </View>
      );
    }
    return (
      <View key={i} style={[pad, { justifyContent: 'center' }]}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: titleColor, textAlign: 'center', marginBottom: 14 }}>
          {t('onboardingTrialTitle')}
        </Text>
        <Text style={{ fontSize: 16, lineHeight: 24, color: bodyColor, textAlign: 'center' }}>{t('onboardingTrialBody')}</Text>
      </View>
    );
  };

  const isTrial = slideIndex >= TRIAL_INDEX;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: pageBg }} edges={['top', 'bottom']}>
      <OnboardingLanguageCombo />
      <View style={{ flex: 1, paddingTop: 70 }}>
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          keyboardShouldPersistTaps="handled"
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
          snapToInterval={windowWidth}
          snapToAlignment="start"
        >
          {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
            <View key={i} style={{ width: windowWidth, flex: 1 }}>
              {renderSlide(i)}
            </View>
          ))}
        </Animated.ScrollView>
      </View>

      <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', paddingVertical: 8 }}>
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => {
            const inputRange = [(i - 1) * windowWidth, i * windowWidth, (i + 1) * windowWidth];
            const dotW = scrollX.interpolate({
              inputRange,
              outputRange: [5, 14, 5],
              extrapolate: 'clamp',
            });
            const dotOp = scrollX.interpolate({
              inputRange,
              outputRange: [0.25, 1, 0.25],
              extrapolate: 'clamp',
            });
            return (
              <Pressable key={i} onPress={() => goToSlide(i)} hitSlop={6} style={{ padding: 3 }}>
                <Animated.View
                  style={{
                    width: dotW,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: accent,
                    opacity: dotOp,
                  }}
                />
              </Pressable>
            );
          })}
        </View>

        {!isTrial ? (
          <Pressable
            onPress={onContinuePress}
            style={{
              backgroundColor: accent,
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>{t('onboardingContinue')}</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={onTrialOk}
            style={{
              backgroundColor: accent,
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>{t('onboardingTrialCta')}</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
