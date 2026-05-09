import AsyncStorage from '@react-native-async-storage/async-storage';

export const FREE_PLAY_LIMIT = 5;

const PAYWALL_ACCESS_KEY = '@notesbasse/paywall_access_v1';
const UNLOCK_PAYWALL_FOR_DEV =
  __DEV__ && process.env.EXPO_PUBLIC_UNLOCK_PAYWALL_FOR_DEV === 'true';

type PaywallAccessState = {
  freeSessionsUsed: number;
  locallyUnlocked: boolean;
};

const DEFAULT_STATE: PaywallAccessState = {
  freeSessionsUsed: 0,
  locallyUnlocked: false,
};

async function saveState(state: PaywallAccessState): Promise<void> {
  await AsyncStorage.setItem(PAYWALL_ACCESS_KEY, JSON.stringify(state));
}

export async function getPaywallAccessState(): Promise<PaywallAccessState> {
  try {
    if (UNLOCK_PAYWALL_FOR_DEV) {
      return { ...DEFAULT_STATE, locallyUnlocked: true };
    }
    const raw = await AsyncStorage.getItem(PAYWALL_ACCESS_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<PaywallAccessState>;
    const freeSessionsUsed =
      typeof parsed.freeSessionsUsed === 'number' ? Math.max(0, Math.floor(parsed.freeSessionsUsed)) : 0;
    const locallyUnlocked = Boolean(parsed.locallyUnlocked);
    return { freeSessionsUsed, locallyUnlocked };
  } catch {
    return DEFAULT_STATE;
  }
}

export async function incrementFreeSessionUsed(): Promise<number> {
  const current = await getPaywallAccessState();
  const next: PaywallAccessState = {
    ...current,
    freeSessionsUsed: current.freeSessionsUsed + 1,
  };
  await saveState(next);
  return next.freeSessionsUsed;
}

export async function markLocallyUnlocked(): Promise<void> {
  const current = await getPaywallAccessState();
  await saveState({
    ...current,
    locallyUnlocked: true,
  });
}

export async function resetPaywallAccess(): Promise<void> {
  await saveState(DEFAULT_STATE);
}

export const resetPaywallAccessForDev = resetPaywallAccess;
