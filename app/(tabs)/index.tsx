import { router } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useNotation } from '@/contexts/notation-context';

const ACCENT_NECK = '#1f6feb';
const ACCENT_FIND = '#b45309';
const CARD_RADIUS = 16;

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
  const cardBase: StyleProp<ViewStyle> = {
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    backgroundColor: isDark ? '#1e2226' : '#fff',
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
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: isDark ? '#9ca3af' : '#64748b',
              marginTop: 4,
              lineHeight: 20,
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
  const { t } = useNotation();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const pageBg = isDark ? Colors.dark.background : '#f4f0eb';
  const heroSub = isDark ? '#9ca3af' : '#5c5348';

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
            borderBottomColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
          }}
        >
          <Text
            style={{
              fontSize: 40,
              fontWeight: '800',
              letterSpacing: -1.2,
              color: isDark ? Colors.dark.text : '#1c1917',
              lineHeight: 44,
            }}
          >
            {t('homeAppName')}
          </Text>
          <Text style={{ fontSize: 17, color: heroSub, marginTop: 10, lineHeight: 24, maxWidth: 360 }}>
            {t('homeTagline')}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 12,
            fontWeight: '700',
            letterSpacing: 1.2,
            color: isDark ? '#64748b' : '#78716c',
            textTransform: 'uppercase',
            marginBottom: 14,
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
      </ScrollView>
    </View>
  );
}
