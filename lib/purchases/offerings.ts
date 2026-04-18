import Purchases, { type PurchasesOffering, type PurchasesPackage } from 'react-native-purchases';

/** Offre courante (dashboard RevenueCat → Offerings → « current »). */
export async function fetchCurrentOffering(): Promise<PurchasesOffering | null> {
  const offerings = await Purchases.getOfferings();
  return offerings.current ?? null;
}

/** Packages affichables (mensuel, annuel, à vie, etc.) pour l’offre courante. */
export async function fetchCurrentPackages(): Promise<PurchasesPackage[]> {
  const current = await fetchCurrentOffering();
  return current?.availablePackages ?? [];
}
