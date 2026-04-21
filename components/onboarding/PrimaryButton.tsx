import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ONBOARDING_COLORS, type OnboardingPalette } from './theme';

export function PrimaryButton({
  title,
  disabled,
  onPress,
  palette = ONBOARDING_COLORS,
  labelFontFamily,
}: {
  title: string;
  disabled?: boolean;
  onPress: () => void;
  palette?: OnboardingPalette;
  labelFontFamily?: string;
}) {
  const pressScale = useSharedValue(1);
  const lastTapMsRef = useRef(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
    opacity: disabled ? 0.7 : 1,
  }));

  const handlePress = async () => {
    if (disabled) return;
    const now = Date.now();
    if (now - lastTapMsRef.current < 150) return;
    lastTapMsRef.current = now;
    await Haptics.selectionAsync();
    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={() => void handlePress()}
        disabled={disabled}
        onPressIn={() => {
          if (disabled) return;
          pressScale.value = withTiming(0.99, { duration: 90, easing: Easing.out(Easing.quad) });
        }}
        onPressOut={() => {
          pressScale.value = withTiming(1, { duration: 140, easing: Easing.out(Easing.quad) });
        }}
      >
        {disabled ? (
          <View
            style={{
              height: 56,
              borderRadius: 28,
              borderWidth: 1,
              borderColor: '#f2e4d6',
              backgroundColor: '#f8f2ea',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#baac9c', fontSize: 18, fontWeight: '700', fontFamily: labelFontFamily }}>{title}</Text>
          </View>
        ) : (
          <LinearGradient
            colors={[palette.accentSoft, palette.accentMid, palette.accentStrong]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700', fontFamily: labelFontFamily }}>{title}</Text>
          </LinearGradient>
        )}
      </Pressable>
    </Animated.View>
  );
}
