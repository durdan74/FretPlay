import { router } from 'expo-router';
import { Manrope_400Regular, Manrope_600SemiBold, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useNotation } from '@/contexts/notation-context';
import { loadGameHistory, type GameSessionRecord } from '@/storage/gameHistory';

const ACCENT_NECK = '#2F80ED';
const ACCENT_FIND = '#4A97F2';
const CARD_RADIUS = 20;

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatShortDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  } catch {
    return '';
  }
}

function computeStreak(sessions: GameSessionRecord[]): number {
  if (sessions.length === 0) return 0;
  const daysWithSession = new Set(
    sessions.map((s) => {
      const d = startOfDay(new Date(s.playedAt));
      return d.getTime();
    }),
  );
  let streak = 0;
  let cursor = startOfDay(new Date());
  while (daysWithSession.has(cursor.getTime())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function GameCard({
  emoji,
  title,
  subtitle,
  accent,
  onPress,
  isDark,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  accent: string;
  onPress: () => void;
  isDark: boolean;
}) {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  const cardBase: StyleProp<ViewStyle> = {
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#d9e4f4',
    backgroundColor: isDark ? '#1e2226' : '#f8fbff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.35 : 0.08,
    shadowRadius: 12,
    elevation: 4,
  };

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: `${accent}33` }}
      style={({ pressed }) => [cardBase, pressed && { opacity: 0.92 }]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'stretch', minHeight: 100 }}>
        <View style={{ width: 5, backgroundColor: accent }} />
        <View style={{ flex: 1, paddingVertical: 18, paddingHorizontal: 18, paddingRight: 14 }}>
          <Text style={{ fontSize: 28, marginBottom: 6 }}>{emoji}</Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '800',
              color: isDark ? Colors.dark.text : Colors.light.text,
              letterSpacing: -0.3,
              fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: isDark ? '#9ca3af' : '#5f6f83',
              marginTop: 4,
              lineHeight: 20,
              fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined,
            }}
          >
            {subtitle}
          </Text>
        </View>
        <View style={{ justifyContent: 'center', paddingRight: 16 }}>
          <Text style={{ fontSize: 22, color: accent, fontWeight: '300' }}>›</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function Index() {
  const { t, resetOnboardingForDev } = useNotation();
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  const insets = useSafeAreaInsets();
  const isDark = false;
  const [history, setHistory] = React.useState<GameSessionRecord[]>([]);

  const pageBg = '#ffffff';
  const heroSub = '#5f6f83';

  useFocusEffect(
    React.useCallback(() => {
      let cancelled = false;
      void loadGameHistory().then((sessions) => {
        if (!cancelled) setHistory(sessions);
      });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const totalSessions = history.length;
  const weekStart = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weeklySessions = history.filter((s) => new Date(s.playedAt).getTime() >= weekStart).length;
  const streak = computeStreak(history);
  const lastSession = history[0];
  const lastScorePct = lastSession ? Math.round((lastSession.found / Math.max(lastSession.attempts, 1)) * 100) : null;
  const continueRoute = lastSession?.gameKind === 'jeu-2' ? '/(tabs)/jeu-2' : '/(tabs)/jeu-1';
  const continueLabel = lastSession?.gameKind === 'jeu-2' ? t('gameNameFindCase') : t('gameNameNeck');

  return (
    <View style={{ flex: 1, backgroundColor: pageBg }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: Math.max(insets.top, 20) + 12,
          paddingBottom: Math.max(insets.bottom, 28) + 24,
          paddingHorizontal: 22,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            marginBottom: 32,
            paddingBottom: 24,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.07)' : '#e4edf8',
          }}
        >
          <Text
            style={{
              fontSize: 40,
              fontWeight: '800',
              letterSpacing: -1.2,
              color: isDark ? Colors.dark.text : '#1c1917',
              lineHeight: 44,
              fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined,
            }}
          >
            {t('homeAppName')}
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: heroSub,
              marginTop: 10,
              lineHeight: 24,
              maxWidth: 360,
              fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined,
            }}
          >
            {t('homeTagline')}
          </Text>
        </View>

        <View
          style={{
            marginBottom: 18,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: '#dce7f4',
            backgroundColor: '#f6faff',
            padding: 16,
          }}
        >
          <Text
            style={{
              color: '#1d3f70',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 1.1,
              fontFamily: fontsLoaded ? 'Manrope_600SemiBold' : undefined,
            }}
          >
            Reprise rapide
          </Text>
          <Text
            style={{
              marginTop: 6,
              color: '#1c2430',
              fontSize: 20,
              lineHeight: 26,
              fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined,
            }}
          >
            {lastSession ? `Continue sur ${continueLabel}` : 'Lance ta première session'}
          </Text>
          <Text
            style={{
              marginTop: 6,
              color: '#5f6f83',
              fontSize: 14,
              lineHeight: 20,
              fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined,
            }}
          >
            {lastSession
              ? `Dernière partie le ${formatShortDate(lastSession.playedAt)} · ${lastScorePct}% de réussite`
              : 'Commence aujourd’hui pour construire ta régularité.'}
          </Text>
          <Pressable
            onPress={() => router.push(continueRoute)}
            style={({ pressed }) => ({
              marginTop: 12,
              height: 48,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#2F80ED',
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 15,
                fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined,
              }}
            >
              {lastSession ? 'Reprendre' : 'Commencer'}
            </Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
          <View
            style={{
              flex: 1,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#dce7f4',
              backgroundColor: '#ffffff',
              paddingVertical: 12,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ color: '#5f6f83', fontSize: 12, fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined }}>
              Série
            </Text>
            <Text style={{ marginTop: 4, color: '#1c2430', fontSize: 24, fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
              {streak} j
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#dce7f4',
              backgroundColor: '#ffffff',
              paddingVertical: 12,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ color: '#5f6f83', fontSize: 12, fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined }}>
              7 derniers jours
            </Text>
            <Text style={{ marginTop: 4, color: '#1c2430', fontSize: 24, fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
              {weeklySessions}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#dce7f4',
              backgroundColor: '#ffffff',
              paddingVertical: 12,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ color: '#5f6f83', fontSize: 12, fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined }}>
              Total
            </Text>
            <Text style={{ marginTop: 4, color: '#1c2430', fontSize: 24, fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
              {totalSessions}
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 12,
            fontWeight: '700',
            letterSpacing: 1.2,
            color: isDark ? '#64748b' : '#6a7f9e',
            textTransform: 'uppercase',
            marginBottom: 14,
            fontFamily: fontsLoaded ? 'Manrope_600SemiBold' : undefined,
          }}
        >
          {t('homeSectionModes')}
        </Text>

        <View style={{ gap: 14 }}>
          <GameCard
            emoji="🎸"
            title={t('gameNameNeck')}
            subtitle={t('homeCardNeckHint')}
            accent={ACCENT_NECK}
            onPress={() => router.push('/(tabs)/jeu-1')}
            isDark={isDark}
          />
          <GameCard
            emoji="🎯"
            title={t('gameNameFindCase')}
            subtitle={t('homeCardFindHint')}
            accent={ACCENT_FIND}
            onPress={() => router.push('/(tabs)/jeu-2')}
            isDark={isDark}
          />
        </View>

        <Pressable
          onPress={() => {
            resetOnboardingForDev();
            router.replace('/onboarding');
          }}
          style={({ pressed }) => ({
            marginTop: 28,
            alignSelf: 'center',
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#dce7f4',
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f5f9ff',
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: isDark ? '#94a3b8' : '#5f6f83',
              fontFamily: fontsLoaded ? 'Manrope_600SemiBold' : undefined,
            }}
          >
            {t('onboardingDevReplay')}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
