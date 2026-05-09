import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { NotationProvider } from '@/contexts/notation-context';
import { OnboardingFlowProvider } from '@/contexts/onboarding-flow-context';
import { PurchasesProvider } from '@/contexts/purchases-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PurchasesProvider>
        <NotationProvider>
          <OnboardingFlowProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="landing" />
              <Stack.Screen
                name="onboarding"
                options={{
                  gestureEnabled: false,
                  fullScreenGestureEnabled: false,
                }}
              />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
            </Stack>
            <StatusBar style="auto" />
          </OnboardingFlowProvider>
        </NotationProvider>
      </PurchasesProvider>
    </ThemeProvider>
  );
}
