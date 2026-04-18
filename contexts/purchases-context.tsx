import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';
import Purchases, { type CustomerInfo, type PurchasesPackage } from 'react-native-purchases';

import { REVENUECAT_ENTITLEMENT_ID } from '@/constants/revenuecat';
import { ensureRevenueCatConfigured } from '@/lib/purchases/configureRevenueCat';

type PurchasesContextValue = {
  isConfigured: boolean;
  isReady: boolean;
  customerInfo: CustomerInfo | null;
  isEntitled: boolean;
  refreshCustomerInfo: () => Promise<void>;
  restorePurchases: () => Promise<CustomerInfo>;
  purchasePackage: (pkg: PurchasesPackage) => Promise<CustomerInfo>;
};

const PurchasesContext = createContext<PurchasesContextValue | null>(null);

const isNativeStore = Platform.OS === 'ios' || Platform.OS === 'android';

export function PurchasesProvider({ children }: { children: ReactNode }) {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  useEffect(() => {
    if (!isNativeStore) {
      setIsReady(true);
      return;
    }

    const configured = ensureRevenueCatConfigured();
    if (!configured) {
      if (__DEV__) {
        console.warn(
          '[RevenueCat] Clé API absente : copier .env.example vers .env et renseigner EXPO_PUBLIC_REVENUECAT_IOS_API_KEY / EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY',
        );
      }
      setIsReady(true);
      return;
    }

    setIsConfigured(true);

    let cancelled = false;

    const onUpdate = (info: CustomerInfo) => {
      if (!cancelled) {
        setCustomerInfo(info);
      }
    };
    Purchases.addCustomerInfoUpdateListener(onUpdate);

    void Purchases.getCustomerInfo()
      .then((info) => {
        if (!cancelled) {
          setCustomerInfo(info);
        }
      })
      .catch(() => {
        /* hors-ligne / sandbox */
      })
      .finally(() => {
        if (!cancelled) {
          setIsReady(true);
        }
      });

    return () => {
      cancelled = true;
      Purchases.removeCustomerInfoUpdateListener(onUpdate);
    };
  }, []);

  const refreshCustomerInfo = useCallback(async () => {
    if (!isNativeStore || !ensureRevenueCatConfigured()) {
      return;
    }
    const info = await Purchases.getCustomerInfo();
    setCustomerInfo(info);
  }, []);

  const restorePurchases = useCallback(async () => {
    if (!isNativeStore || !ensureRevenueCatConfigured()) {
      throw new Error('RevenueCat non disponible sur cette plateforme.');
    }
    const info = await Purchases.restorePurchases();
    setCustomerInfo(info);
    return info;
  }, []);

  const purchasePackage = useCallback(async (pkg: PurchasesPackage) => {
    if (!isNativeStore || !ensureRevenueCatConfigured()) {
      throw new Error('RevenueCat non disponible sur cette plateforme.');
    }
    const { customerInfo: info } = await Purchases.purchasePackage(pkg);
    setCustomerInfo(info);
    return info;
  }, []);

  const isEntitled = useMemo(() => {
    if (!customerInfo) {
      return false;
    }
    return Boolean(customerInfo.entitlements.active[REVENUECAT_ENTITLEMENT_ID]);
  }, [customerInfo]);

  const value = useMemo(
    () => ({
      isConfigured,
      isReady,
      customerInfo,
      isEntitled,
      refreshCustomerInfo,
      restorePurchases,
      purchasePackage,
    }),
    [
      isConfigured,
      isReady,
      customerInfo,
      isEntitled,
      refreshCustomerInfo,
      restorePurchases,
      purchasePackage,
    ],
  );

  return <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>;
}

export function usePurchases() {
  const ctx = useContext(PurchasesContext);
  if (!ctx) {
    throw new Error('usePurchases must be used within PurchasesProvider');
  }
  return ctx;
}
