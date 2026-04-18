import { useFocusEffect } from '@react-navigation/native';
import { router, type Href } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { loadGameHistory, type GameSessionRecord } from '@/storage/gameHistory';

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('fr-FR', {
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

function notationLabel(n: GameSessionRecord['notation']): string {
  return n === 'european' ? 'Européen' : 'Anglo-saxon';
}

export default function HistoriqueScreen() {
  const [sessions, setSessions] = useState<GameSessionRecord[]>([]);

  const refresh = useCallback(() => {
    void loadGameHistory().then(setSessions);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
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
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: '700' }}>Historique</Text>
        <Pressable
          onPress={() => router.replace('/(tabs)/jeu-1' as Href)}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 10,
            backgroundColor: '#1f6feb',
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Retour au jeu</Text>
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {sessions.length === 0 ? (
          <Text style={{ fontSize: 16, color: '#666' }}>Aucune partie enregistrée pour le moment.</Text>
        ) : (
          sessions.map((s) => (
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
              <Text style={{ fontSize: 15, fontWeight: '600', marginBottom: 6 }}>{formatDate(s.playedAt)}</Text>
              <Text style={{ fontSize: 14, color: '#444' }}>
                {notationLabel(s.notation)} · {s.found}/{s.attempts} trouvées · {s.missed} ratées ·{' '}
                {(s.durationMs / 1000).toFixed(1)} s
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
