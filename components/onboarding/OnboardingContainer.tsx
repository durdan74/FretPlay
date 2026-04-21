import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

export function OnboardingContainer({ children }: { children: React.ReactNode }) {
  const [focusTick, setFocusTick] = useState(0);
  const fadeOpacity = useSharedValue(0);
  const slideTranslateY = useSharedValue(20);
  const contentOpacity = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      setFocusTick((v) => v + 1);
      return undefined;
    }, []),
  );

  useEffect(() => {
    fadeOpacity.value = 0;
    slideTranslateY.value = 20;
    contentOpacity.value = 0;
    fadeOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
    slideTranslateY.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) });
    contentOpacity.value = withDelay(150, withTiming(1, { duration: 350, easing: Easing.out(Easing.quad) }));
  }, [contentOpacity, fadeOpacity, focusTick, slideTranslateY]);

  const shellStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
    transform: [{ translateY: slideTranslateY.value }],
  }));
  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));

  return (
    <Animated.View style={[{ flex: 1 }, shellStyle]}>
      <Animated.View style={[{ flex: 1 }, contentStyle]}>{children}</Animated.View>
    </Animated.View>
  );
}
