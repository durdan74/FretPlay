import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { View } from 'react-native';

import { getLastOnboardingProgress, setLastOnboardingProgress } from '@/utils/onboardingProgress';

import { ONBOARDING_COLORS } from './theme';

export function GradientProgressBar({ percentage, height = 5 }: { percentage: number; height?: number }) {
  const progressValue = useSharedValue(getLastOnboardingProgress());

  React.useEffect(() => {
    progressValue.value = withDelay(
      140,
      withTiming(percentage, {
        duration: 420,
        easing: Easing.out(Easing.cubic),
      }),
    );
    setLastOnboardingProgress(percentage);
  }, [percentage, progressValue]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value}%`,
  }));

  return (
    <View style={{ height, borderRadius: height / 2, overflow: 'hidden', backgroundColor: ONBOARDING_COLORS.progressTrack }}>
      <Animated.View style={[{ height: '100%', borderRadius: height / 2, overflow: 'hidden' }, fillStyle]}>
        <LinearGradient
          colors={[ONBOARDING_COLORS.accentSoft, ONBOARDING_COLORS.accentMid, ONBOARDING_COLORS.accentStrong]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: '100%', height: '100%' }}
        />
      </Animated.View>
    </View>
  );
}
