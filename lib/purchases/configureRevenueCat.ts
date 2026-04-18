import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

import { getRevenueCatPublicApiKey } from '@/lib/purchases/revenueCatApiKey';

let didConfigure = false;

/**
 * Configure le SDK une seule fois (évite les doubles appels en dev / re-renders).
 * @returns true si le SDK est prêt à être utilisé.
 */
export function ensureRevenueCatConfigured(): boolean {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return false;
  }
  if (didConfigure) {
    return true;
  }
  const apiKey = getRevenueCatPublicApiKey();
  if (!apiKey) {
    return false;
  }
  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN);
  Purchases.configure({ apiKey });
  didConfigure = true;
  return true;
}
