import { Redirect } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { useNotation } from '@/contexts/notation-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { Colors } from '@/constants/theme';

/**
 * Point d’entrée : après hydratation des paramètres, intro ou onglets.
 */
export default function RootIndex() {
  const { isHydrated, onboardingCompleted } = useNotation();
  const colorScheme = useColorScheme() ?? 'light';
  const bg = Colors[colorScheme].background;

  if (!isHydrated) {
    return <View style={{ flex: 1, backgroundColor: bg }} />;
  }

  if (!onboardingCompleted) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
