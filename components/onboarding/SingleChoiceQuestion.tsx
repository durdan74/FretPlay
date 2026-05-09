import { Manrope_400Regular, Manrope_500Medium, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import React, { useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { OnboardingContainer } from './OnboardingContainer';
import { OnboardingHeader } from './OnboardingHeader';
import { SelectionButton } from './SelectionButton';
import { ONBOARDING_COLORS, ONBOARDING_PALETTES, type OnboardingPalette } from './theme';

export function SingleChoiceQuestion({
  title,
  description,
  options,
  progress,
  onBack,
  onSelect,
  navigationDelayMs = 220,
}: {
  title: string;
  description: string;
  options: readonly string[];
  progress: number;
  onBack: () => void;
  onSelect: (index: number) => void;
  navigationDelayMs?: number;
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const subtitleColor = palette.textMuted ?? ONBOARDING_COLORS.textSecondary;
  const titleFontFamily = undefined;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isNavigatingRef = useRef(false);
  const uiPalette: OnboardingPalette = ONBOARDING_PALETTES.D;
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_700Bold,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'bottom']}>
      <OnboardingContainer>
        <View style={{ paddingTop: 20, paddingHorizontal: 20 }}>
          <OnboardingHeader progress={progress} onBack={onBack} />
          <Text
            style={{
              fontSize: 30,
              fontWeight: '500',
              color: uiPalette.title,
              lineHeight: 37,
              fontFamily: fontsLoaded ? 'Manrope_700Bold' : titleFontFamily,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              marginTop: 10,
              color: subtitleColor,
              fontSize: 16,
              lineHeight: 23,
              marginBottom: 4,
              fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined,
            }}
          >
            {description}
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 26 }}
          showsVerticalScrollIndicator={false}
          bounces
          alwaysBounceVertical={false}
          decelerationRate="normal"
          keyboardShouldPersistTaps="handled"
          overScrollMode="never"
          scrollEventThrottle={16}
        >
          {options.map((label, idx) => (
            <SelectionButton
              key={`${title}-${label}`}
              label={label}
              selected={selectedIndex === idx}
              index={idx}
              palette={uiPalette}
              labelFontFamily={fontsLoaded ? 'Manrope_500Medium' : undefined}
              onSelect={() => {
                if (isNavigatingRef.current) return;
                isNavigatingRef.current = true;
                setSelectedIndex(idx);
                setTimeout(() => {
                  onSelect(idx);
                  isNavigatingRef.current = false;
                }, navigationDelayMs);
              }}
            />
          ))}
        </ScrollView>
      </OnboardingContainer>
    </SafeAreaView>
  );
}
