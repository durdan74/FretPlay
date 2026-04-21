import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useNotation } from '@/contexts/notation-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { ParametresReturnProvider, useParametresReturn, type ReturnableTabName } from './parametres-return-context';

function isReturnableTabName(name: string | undefined): name is ReturnableTabName {
  return name === 'index' || name === 'jeu-1' || name === 'jeu-2';
}

function TabsNavigator() {
  const colorScheme = useColorScheme();
  const { setReturnTab } = useParametresReturn();
  const { t } = useNotation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: '#7a8ca8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#dce7f4',
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabMenu'),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              size={24}
              name={focused ? 'home' : 'home-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="jeu-1"
        options={{
          title: t('gameNameNeck'),
          href: null,
        }}
      />
      <Tabs.Screen
        name="jeu-2"
        options={{
          title: t('gameNameFindCase'),
          href: null,
        }}
      />
      <Tabs.Screen
        name="historique"
        options={{
          title: t('tabHistory'),
          href: null,
        }}
      />
      <Tabs.Screen
        name="parametres"
        options={{
          title: t('tabSettings'),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              size={24}
              name={focused ? 'tune-variant' : 'tune-variant'}
              color={color}
            />
          ),
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
