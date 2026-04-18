import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useNotation } from '@/contexts/notation-context';
import { fillTemplate } from '@/lib/i18n/template';
import type { UiLanguage } from '@/lib/i18n/types';
import { loadGameHistory, type GameKind, type GameSessionRecord } from '@/storage/gameHistory';

function localeTagForUi(lang: UiLanguage): string {
  if (lang === 'fr') return 'fr-FR';
  if (lang === 'es') return 'es-ES';
  if (lang === 'de') return 'de-DE';
  if (lang === 'it') return 'it-IT';
  return 'en-GB';
}

function formatDate(iso: string, uiLanguage: UiLanguage): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(localeTagForUi(uiLanguage), {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function parseGameKind(raw: string | string[] | undefined): GameKind {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === 'jeu-2' ? 'jeu-2' : 'jeu-1';
}

function filterByKind(sessions: GameSessionRecord[], kind: GameKind): GameSessionRecord[] {
  return sessions.filter((s) => s.gameKind === kind);
}

export default function HistoriqueScreen() {
  const { jeu } = useLocalSearchParams<{ jeu?: string }>();
  const gameKind = useMemo(() => parseGameKind(jeu), [jeu]);
  const { t, uiLanguage } = useNotation();

  const [sessions, setSessions] = useState<GameSessionRecord[]>([]);

  const refresh = useCallback(() => {
    void loadGameHistory().then(setSessions);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const filtered = useMemo(() => filterByKind(sessions, gameKind), [sessions, gameKind]);
  const gameTitle = gameKind === 'jeu-2' ? t('historiqueSubtitleFindCase') : t('historiqueSubtitleNeck');
  const gameHref = useMemo<Href>(
    () => (gameKind === 'jeu-2' ? '/(tabs)/jeu-2' : '/(tabs)/jeu-1'),
    [gameKind],
  );

  const retourAuJeu = useCallback(() => {
    router.replace(gameHref);
  }, [gameHref]);

  const formatSessionLine = useCallback(
    (s: GameSessionRecord) => {
      const notation =
        s.notation === 'european' ? t('notationSystemEuropean') : t('notationSystemAnglo');
      return fillTemplate(t('historiqueRow'), {
        notation,
        found: s.found,
        attempts: s.attempts,
        missed: s.missed,
        sec: (s.durationMs / 1000).toFixed(1),
      });
    },
    [t],
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 64,
        paddingBottom: 24,
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: '700' }}>{t('historiqueTitle')}</Text>
        <Pressable
          onPress={retourAuJeu}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 10,
            backgroundColor: '#1f6feb',
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>{t('historiqueBackToGame')}</Text>
        </Pressable>
      </View>

      <Text style={{ fontSize: 17, fontWeight: '600', color: '#444', marginBottom: 14 }}>{gameTitle}</Text>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <Text style={{ fontSize: 16, color: '#666' }}>{t('historiqueEmpty')}</Text>
        ) : (
          filtered.map((s) => (
            <View
              key={s.id}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 12,
                marginBottom: 10,
                borderRadius: 10,
                backgroundColor: '#f4f4f5',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', marginBottom: 6 }}>
                {formatDate(s.playedAt, uiLanguage)}
              </Text>
              <Text style={{ fontSize: 14, color: '#444' }}>{formatSessionLine(s)}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
