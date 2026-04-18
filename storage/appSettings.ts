import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';

import type { NotationSystem } from '@/app/(tabs)/bass/constants';
import { getDefaultNotationFromLocale } from '@/lib/defaultNotation';

/** Incrémenter si la forme du JSON change (migration). */
export const APP_SETTINGS_VERSION = 1;

const APP_DIR_NAME = 'notesbasse';
const SETTINGS_FILENAME = 'settings.json';

/** Ancienne clé AsyncStorage (notation seule) — migrée vers le fichier JSON. */
const LEGACY_NOTATION_KEY = '@notesbasse/notation_system';

/** Repli si le système de fichiers n’est pas utilisable (ex. web). */
const ASYNC_FALLBACK_KEY = '@notesbasse/app_settings.json';

export type AppSettings = {
  settingsVersion: number;
  notation: NotationSystem;
};

export function getDefaultAppSettings(): AppSettings {
  return {
    settingsVersion: APP_SETTINGS_VERSION,
    notation: getDefaultNotationFromLocale(),
  };
}

function parseSettingsJson(raw: string | null): AppSettings | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== 'object') return null;
    const notation = (o as { notation?: unknown }).notation;
    if (notation !== 'european' && notation !== 'anglo-saxon') return null;
    const v = (o as { settingsVersion?: unknown }).settingsVersion;
    const settingsVersion = typeof v === 'number' ? v : APP_SETTINGS_VERSION;
    return { settingsVersion, notation };
  } catch {
    return null;
  }
}

async function readSettingsFromFile(): Promise<string | null> {
  try {
    const file = new File(Paths.document, APP_DIR_NAME, SETTINGS_FILENAME);
    if (!file.exists) return null;
    return await file.text();
  } catch {
    return null;
  }
}

async function writeSettingsToFile(json: string): Promise<boolean> {
  try {
    const appDir = new Directory(Paths.document, APP_DIR_NAME);
    if (!appDir.exists) {
      appDir.create({ intermediates: true, idempotent: true });
    }
    const file = new File(appDir, SETTINGS_FILENAME);
    if (!file.exists) {
      file.create();
    }
    file.write(json);
    return true;
  } catch {
    return false;
  }
}

/**
 * Charge les paramètres : fichier `notesbasse/settings.json`, puis repli AsyncStorage, puis migration depuis l’ancienne clé notation.
 */
export async function loadAppSettings(): Promise<AppSettings> {
  const fromFile = await readSettingsFromFile();
  const parsedFile = parseSettingsJson(fromFile);
  if (parsedFile) {
    return parsedFile;
  }

  const fromFallback = await AsyncStorage.getItem(ASYNC_FALLBACK_KEY);
  const parsedFallback = parseSettingsJson(fromFallback);
  if (parsedFallback) {
    return parsedFallback;
  }

  const legacy = await AsyncStorage.getItem(LEGACY_NOTATION_KEY);
  if (legacy === 'european' || legacy === 'anglo-saxon') {
    const migrated: AppSettings = {
      settingsVersion: APP_SETTINGS_VERSION,
      notation: legacy,
    };
    await saveAppSettings(migrated);
    await AsyncStorage.removeItem(LEGACY_NOTATION_KEY);
    return migrated;
  }

  return getDefaultAppSettings();
}

/**
 * Enregistre tout le fichier de configuration (JSON indenté pour lecture humaine).
 */
export async function saveAppSettings(settings: AppSettings): Promise<void> {
  const body = JSON.stringify(settings, null, 2);
  const written = await writeSettingsToFile(body);
  if (!written) {
    await AsyncStorage.setItem(ASYNC_FALLBACK_KEY, body);
  }
}
