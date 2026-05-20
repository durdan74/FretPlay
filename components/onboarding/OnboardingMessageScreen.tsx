import { Manrope_400Regular, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import { Image } from 'expo-image';
import React from 'react';
import type { ImageSourcePropType } from 'react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ONBOARDING_COLORS } from './theme';
import { AnimatedNextButton } from './AnimatedNextButton';
import { OnboardingContainer } from './OnboardingContainer';
import { OnboardingHeader } from './OnboardingHeader';

export function OnboardingMessageScreen({
  progress,
  title,
  description,
  onBack,
  onNext,
  nextLabel = 'Continuer',
  disableBack = false,
  imageSource,
  imageAspectRatio = 1,
  imageHeight,
  imageContentFit = 'cover',
}: {
  progress: number;
  title: string;
  description: string;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  disableBack?: boolean;
  imageSource?: ImageSourcePropType;
  imageAspectRatio?: number;
  imageHeight?: number;
  imageContentFit?: 'cover' | 'contain';
}) {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_700Bold,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'bottom']}>
      <OnboardingContainer>
        <View style={{ paddingTop: 20, paddingHorizontal: 20 }}>
          <OnboardingHeader progress={progress} onBack={onBack} disableBack={disableBack} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: '500',
              color: ONBOARDING_COLORS.title,
              lineHeight: 37,
              fontFamily: fontsLoaded ? 'Manrope_700Bold' : undefined,
            }}
          >
            {title}
          </Text>
          <View
            style={{
              marginTop: 24,
              borderRadius: 24,
              borderWidth: imageSource ? 0 : 1,
              borderColor: imageSource ? 'transparent' : '#d8e4f2',
              backgroundColor: imageSource ? 'transparent' : '#eff5ff',
              width: '100%',
              height: imageSource ? imageHeight : 240,
              aspectRatio: imageSource && !imageHeight ? imageAspectRatio : undefined,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              paddingHorizontal: imageSource ? 0 : 16,
            }}
          >
            {imageSource ? (
              <Image
                source={imageSource}
                contentFit={imageContentFit}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  color: '#7a8fae',
                  fontSize: 14,
                  lineHeight: 21,
                  fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined,
                }}
              >
                Zone graphique placeholder (tu peux insérer ton visuel ici)
              </Text>
            )}
          </View>

          <Text
            style={{
              marginTop: 18,
              marginBottom: 8,
              color: ONBOARDING_COLORS.textSecondary,
              fontSize: 16,
              lineHeight: 23,
              fontFamily: fontsLoaded ? 'Manrope_400Regular' : undefined,
            }}
          >
            {description}
          </Text>
        </ScrollView>

        <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 }}>
          <AnimatedNextButton onPress={onNext} title={nextLabel} />
        </View>
      </OnboardingContainer>
    </SafeAreaView>
  );
}
