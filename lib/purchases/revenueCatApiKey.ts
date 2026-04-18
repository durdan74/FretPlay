import { Platform } from 'react-native';

/** Clés API publiques du projet RevenueCat (Project settings → API keys). */
export function getRevenueCatPublicApiKey(): string | undefined {
  if (Platform.OS === 'ios') {
    return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
  }
  if (Platform.OS === 'android') {
    return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
  }
  return undefined;
}
