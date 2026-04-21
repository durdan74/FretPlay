import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { ONBOARDING_COLORS, type OnboardingPalette } from './theme';

export function SelectionButton({
  label,
  selected,
  index,
  onSelect,
  indicatorShape = 'circle',
  palette = ONBOARDING_COLORS,
  labelFontFamily,
}: {
  label: string;
  selected: boolean;
  index: number;
  onSelect: () => void;
  indicatorShape?: 'circle' | 'square-check';
  palette?: OnboardingPalette;
  labelFontFamily?: string;
}) {
  const pressScale = useSharedValue(1);
  const selectedProgress = useSharedValue(selected ? 1 : 0);
  const entryProgress = useSharedValue(0);
  const lastTapMsRef = useRef(0);

  useEffect(() => {
    selectedProgress.value = withTiming(selected ? 1 : 0, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
  }, [selected, selectedProgress]);

  useEffect(() => {
    entryProgress.value = 0;
    entryProgress.value = withDelay(100 + index * 30, withTiming(1, { duration: 150, easing: Easing.out(Easing.quad) }));
  }, [entryProgress, index]);

  const containerStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(selectedProgress.value, [0, 1], ['#ffffff', palette.accentTint]);
    const border = interpolateColor(selectedProgress.value, [0, 1], [palette.borderIdle, palette.borderActive]);
    const opacity = interpolate(entryProgress.value, [0, 1], [0, 1]);
    const translateY = interpolate(entryProgress.value, [0, 1], [8, 0]);
    return {
      backgroundColor: bg,
      borderColor: border,
      opacity,
      transform: [{ translateY }, { scale: pressScale.value }],
    };
  });

  const radioStyle = useAnimatedStyle(() => {
    const border = interpolateColor(selectedProgress.value, [0, 1], [palette.indicatorIdle, palette.accentStrong]);
    return { borderColor: border };
  });
  const checkWrapStyle = useAnimatedStyle(() => {
    const border = interpolateColor(selectedProgress.value, [0, 1], [palette.indicatorIdle, palette.accentStrong]);
    const bg = interpolateColor(selectedProgress.value, [0, 1], ['transparent', palette.accentStrong]);
    return { borderColor: border, backgroundColor: bg };
  });

  const dotStyle = useAnimatedStyle(() => ({
    opacity: selectedProgress.value,
    transform: [{ scale: interpolate(selectedProgress.value, [0, 1], [0.6, 1]) }],
  }));
  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(selectedProgress.value, [0, 1], [palette.text, palette.title]),
  }));

  const handlePress = async () => {
    const now = Date.now();
    if (now - lastTapMsRef.current < 150) return;
    lastTapMsRef.current = now;
    await Haptics.selectionAsync();
    onSelect();
  };

  return (
    <Animated.View style={[{ marginBottom: 10, borderRadius: 20, borderWidth: 1.5 }, containerStyle]}>
      <Pressable
        onPress={() => void handlePress()}
        onPressIn={() => {
          pressScale.value = withTiming(0.985, { duration: 90, easing: Easing.out(Easing.quad) });
        }}
        onPressOut={() => {
          pressScale.value = withTiming(1, { duration: 140, easing: Easing.out(Easing.quad) });
        }}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Animated.Text style={[{ flex: 1, marginRight: 12, fontSize: 16, fontWeight: '500', fontFamily: labelFontFamily }, labelStyle]}>
          {label}
        </Animated.Text>
        {indicatorShape === 'square-check' ? (
          <Animated.View
            style={[
              {
                width: 24,
                height: 24,
                borderRadius: 7,
                borderWidth: 2,
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              },
              checkWrapStyle,
            ]}
          >
            <Animated.View style={dotStyle}>
              <MaterialCommunityIcons name="check" size={14} color="#ffffff" />
            </Animated.View>
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              {
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              },
              radioStyle,
            ]}
          >
            <Animated.View
              style={[{ width: 10, height: 10, borderRadius: 5, backgroundColor: palette.accentStrong }, dotStyle]}
            />
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
}
