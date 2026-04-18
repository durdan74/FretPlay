import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { ParametresReturnProvider, useParametresReturn, type ReturnableTabName } from './parametres-return-context';

function isReturnableTabName(name: string | undefined): name is ReturnableTabName {
  return name === 'index' || name === 'jeu-1';
}

function TabsNavigator() {
  const colorScheme = useColorScheme();
  const { setReturnTab } = useParametresReturn();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="jeu-1"
        options={{
          title: 'Jeu 1',
          href: null,
        }}
      />
      <Tabs.Screen
        name="historique"
        options={{
          title: 'Historique',
          href: null,
        }}
      />
      <Tabs.Screen
        name="parametres"
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            const state = navigation.getState();
            const route = state.routes[state.index];
            const name = route?.name;
            if (isReturnableTabName(name)) {
              setReturnTab(name);
            }
          },
        })}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <ParametresReturnProvider>
      <TabsNavigator />
    </ParametresReturnProvider>
  );
}
