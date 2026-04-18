import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';

import type { NotationSystem } from '@/app/(tabs)/bass/constants';

const APP_DIR_NAME = 'notesbasse';
const HISTORY_FILENAME = 'game_history.json';
const ASYNC_FALLBACK_KEY = '@notesbasse/game_history.json';

/** Nombre max. de parties conservées (les plus récentes d’abord). */
export const MAX_GAME_HISTORY_SESSIONS = 100;

export const GAME_HISTORY_FILE_VERSION = 1;

export type GameKind = 'jeu-1' | 'jeu-2';

export type GameSessionRecord = {
  id: string;
  /** Fin de partie (ISO 8601). */
  playedAt: string;
  notation: NotationSystem;
  attempts: number;
  found: number;
  missed: number;
  /** Durée entre le 1er et le 10e essai, en millisecondes. */
  durationMs: number;
  /** Absent dans les anciennes données : traité comme « Note sur le manche » (jeu-1). */
  gameKind: GameKind;
};

type GameHistoryFile = {
  historyVersion: number;
  sessions: GameSessionRecord[];
};

function newSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

type RawGameSession = Omit<GameSessionRecord, 'gameKind'> & { gameKind?: unknown };

function isRawGameSession(o: unknown): o is RawGameSession {
  if (!o || typeof o !== 'object') return false;
  const r = o as Record<string, unknown>;
  const kindOk =
    r.gameKind === undefined ||
    r.gameKind === 'jeu-1' ||
    r.gameKind === 'jeu-2';
  return (
    kindOk &&
    typeof r.id === 'string' &&
    typeof r.playedAt === 'string' &&
    (r.notation === 'european' || r.notation === 'anglo-saxon') &&
    typeof r.attempts === 'number' &&
    typeof r.found === 'number' &&
    typeof r.missed === 'number' &&
    typeof r.durationMs === 'number'
  );
}

function normalizeGameKind(raw: RawGameSession): GameSessionRecord {
  const gameKind: GameKind = raw.gameKind === 'jeu-2' ? 'jeu-2' : 'jeu-1';
  return {
    id: raw.id,
    playedAt: raw.playedAt,
    notation: raw.notation,
    attempts: raw.attempts,
    found: raw.found,
    missed: raw.missed,
    durationMs: raw.durationMs,
    gameKind,
  };
}

function parseHistoryFile(raw: string | null): GameSessionRecord[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (Array.isArray(data)) {
      return data.filter(isRawGameSession).map(normalizeGameKind);
    }
    if (data && typeof data === 'object' && Array.isArray((data as GameHistoryFile).sessions)) {
      return (data as GameHistoryFile).sessions.filter(isRawGameSession).map(normalizeGameKind);
    }
  } catch {
    /* ignore */
  }
  return [];
}

async function readHistoryFromFile(): Promise<string | null> {
  try {
    const file = new File(Paths.document, APP_DIR_NAME, HISTORY_FILENAME);
    if (!file.exists) return null;
    return await file.text();
  } catch {
    return null;
  }
}

async function writeHistoryToFile(json: string): Promise<boolean> {
  try {
    const appDir = new Directory(Paths.document, APP_DIR_NAME);
    if (!appDir.exists) {
      appDir.create({ intermediates: true, idempotent: true });
    }
    const file = new File(appDir, HISTORY_FILENAME);
    if (!file.exists) {
      file.create();
    }
    file.write(json);
    return true;
  } catch {
    return false;
  }
}

function mergeSessions(a: GameSessionRecord[], b: GameSessionRecord[]): GameSessionRecord[] {
  const byId = new Map<string, GameSessionRecord>();
  for (const s of [...a, ...b]) {
    byId.set(s.id, s);
  }
  return Array.from(byId.values()).sort(
    (x, y) => new Date(y.playedAt).getTime() - new Date(x.playedAt).getTime(),
  );
}

/**
 * Lit fichier + repli AsyncStorage et fusionne (évite les écarts web / natif ou fichier illisible).
 */
export async function loadGameHistory(): Promise<GameSessionRecord[]> {
  const [fromFileRaw, fromAsyncRaw] = await Promise.all([
    readHistoryFromFile(),
    AsyncStorage.getItem(ASYNC_FALLBACK_KEY),
  ]);
  const fromFileSessions = parseHistoryFile(fromFileRaw);
  const fromAsyncSessions = parseHistoryFile(fromAsyncRaw);
  return mergeSessions(fromFileSessions, fromAsyncSessions);
}

async function saveGameHistorySessions(sessions: GameSessionRecord[]): Promise<void> {
  const payload: GameHistoryFile = {
    historyVersion: GAME_HISTORY_FILE_VERSION,
    sessions,
  };
  const body = JSON.stringify(payload, null, 2);
  await AsyncStorage.setItem(ASYNC_FALLBACK_KEY, body);
  await writeHistoryToFile(body);
}

/**
 * Ajoute une partie terminée en tête de l’historique et tronque à {@link MAX_GAME_HISTORY_SESSIONS}.
 */
export async function appendGameSession(session: Omit<GameSessionRecord, 'id'> & { id?: string }): Promise<void> {
  const record: GameSessionRecord = {
    ...session,
    id: session.id ?? newSessionId(),
  };

  const existing = await loadGameHistory();
  const next = [record, ...existing].slice(0, MAX_GAME_HISTORY_SESSIONS);
  await saveGameHistorySessions(next);
}
