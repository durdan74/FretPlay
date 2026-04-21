import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { GradientProgressBar } from './GradientProgressBar';

export function OnboardingHeader({
  progress,
  onBack,
}: {
  progress: number;
  onBack: () => void;
}) {
  const [fontsLoaded] = useFonts({ Manrope_700Bold });

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
      <Pressable
        onPress={onBack}
        hitSlop={8}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#d9e4f4',
          backgroundColor: '#f7fbff',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.04,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 1,
        }}
      >
        <MaterialCommunityIcons name="chevron-left" size={22} color="#2e3f56" />
      </Pressable>

      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <GradientProgressBar percentage={progress} height={5} />
      </View>

      <View
        style={{
          minWidth: 62,
          height: 40,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#d9e4f4',
          backgroundColor: '#f7fbff',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 12,
          gap: 5,
          shadowColor: '#000',
          shadowOpacity: 0.03,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 1,
        }}
      >
        <Text style={{ fontSize: 16 }}>🇫🇷</Text>
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#4b688d', fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined }}>
          FR
        </Text>
      </View>
    </View>
  );
}
