import * as Haptics from 'expo-haptics';
import { router, type Href } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { getNotesPoolForNotation, NUMBER_OF_FRETS, type NotationSystem } from '@/app/(tabs)/bass/constants';
import { useNotation } from '@/contexts/notation-context';
import { encouragementForFound } from '@/lib/i18n/strings';
import { getDefaultAppSettings } from '@/storage/appSettings';
import { appendGameSession } from '@/storage/gameHistory';

import { BassNeck } from './bass/BassNeck';
import { getNoteForPosition, getPitchClass, samePitch } from './bass/noteUtils';

const TOTAL_ATTEMPTS = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickSpellingForPitchClass(pc: number, pool: string[]): string {
  const candidates = pool.filter((n) => getPitchClass(n) === pc);
  return candidates[Math.floor(Math.random() * candidates.length)] ?? pool[0];
}

function buildFiveChoices(answerNote: string, pool: string[]): string[] {
  const answerPc = getPitchClass(answerNote);
  const otherPcs = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter((p) => p !== answerPc)).slice(
    0,
    4,
  );
  const pcs = shuffle([answerPc, ...otherPcs]);
  const labels = pcs.map((pc) => pickSpellingForPitchClass(pc, pool));
  return shuffle(labels);
}

function pickRandomPosition(): { stringNum: number; fret: number } {
  const strings = [1, 2, 3, 4] as const;
  const stringNum = strings[Math.floor(Math.random() * 4)]!;
  const fret = Math.floor(Math.random() * NUMBER_OF_FRETS);
  return { stringNum, fret };
}

type RoundState = {
  markerPos: { stringNum: number; fret: number };
  answerNote: string;
  choices: string[];
};

function createRound(notationArg: NotationSystem): RoundState {
  const markerPos = pickRandomPosition();
  const answerNote = getNoteForPosition(markerPos.stringNum, markerPos.fret, notationArg);
  const choices = buildFiveChoices(answerNote, getNotesPoolForNotation(notationArg));
  return { markerPos, answerNote, choices };
}

export default function Jeu2Screen() {
  const { notation, isHydrated, t, uiLanguage } = useNotation();

  const [round, setRound] = useState<RoundState>(() => createRound(getDefaultAppSettings().notation));
  const [pickedNote, setPickedNote] = useState<string | null>(null);
  const [revealedWrong, setRevealedWrong] = useState(false);
  const [foundCount, setFoundCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [endDialogDismissed, setEndDialogDismissed] = useState(false);

  const gameStartedAtRef = useRef<number | null>(null);
  const wasHydratedRef = useRef(false);
  const lastNotationRef = useRef(notation);

  const startNewRound = useCallback((notationArg: NotationSystem) => {
    setRound(createRound(notationArg));
    setPickedNote(null);
    setRevealedWrong(false);
  }, []);

  const resetFullGame = useCallback(() => {
    setFoundCount(0);
    setMissedCount(0);
    setAttemptCount(0);
    setEndDialogDismissed(false);
    gameStartedAtRef.current = null;
    startNewRound(notation);
  }, [notation, startNewRound]);

  useEffect(() => {
    if (!isHydrated) return;

    if (!wasHydratedRef.current) {
      wasHydratedRef.current = true;
      startNewRound(notation);
      lastNotationRef.current = notation;
      return;
    }

    if (lastNotationRef.current !== notation) {
      lastNotationRef.current = notation;
      resetFullGame();
    }
  }, [isHydrated, notation, resetFullGame, startNewRound]);

  const onPickNote = (note: string) => {
    if (attemptCount >= TOTAL_ATTEMPTS) return;
    if (pickedNote !== null) return;

    setPickedNote(note);
    if (!samePitch(note, round.answerNote)) {
      setRevealedWrong(true);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const onSuivant = () => {
    if (attemptCount >= TOTAL_ATTEMPTS) return;

    if (attemptCount === 0) {
      gameStartedAtRef.current = Date.now();
    }

    const hadPick = pickedNote !== null;
    const wasCorrect = hadPick && samePitch(pickedNote, round.answerNote);
    const nextFound = foundCount + (wasCorrect ? 1 : 0);
    const nextMissed = missedCount + (wasCorrect ? 0 : 1);
    const nextAttempt = attemptCount + 1;

    setFoundCount(nextFound);
    setMissedCount(nextMissed);
    setAttemptCount(nextAttempt);

    if (nextAttempt >= TOTAL_ATTEMPTS) {
      const endedAt = Date.now();
      const startedAt = gameStartedAtRef.current ?? endedAt;
      gameStartedAtRef.current = null;
      void appendGameSession({
        playedAt: new Date(endedAt).toISOString(),
        notation,
        attempts: TOTAL_ATTEMPTS,
        found: nextFound,
        missed: nextMissed,
        durationMs: Math.max(0, endedAt - startedAt),
        gameKind: 'jeu-2',
      });
      return;
    }

    startNewRound(notation);
  };

  const isGameFinished = attemptCount >= TOTAL_ATTEMPTS;
  const showEndDialog = isGameFinished && !endDialogDismissed;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 64,
        paddingBottom: 20,
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'stretch',
        }}
      >
        <BassNeck
          selectedString={null}
          selectedFret={null}
          selectedResult={null}
          wrongPlayedNote={null}
          onSelect={() => {}}
          neckInteractive={false}
          answerMarker={
            isGameFinished ? null : { stringNum: round.markerPos.stringNum, fret: round.markerPos.fret }
          }
        />

        <View
          style={{
            width: '35%',
            alignSelf: 'stretch',
            justifyContent: 'flex-start',
            paddingLeft: 8,
            paddingTop: 12,
            position: 'relative',
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
            <Pressable
              onPress={() => router.push('/(tabs)/historique?jeu=jeu-2' as Href)}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderRadius: 8,
                backgroundColor: '#e8e8ea',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#1a1a1a' }}>{t('historique')}</Text>
            </Pressable>
          </View>

          <View style={{ marginTop: 14 }}>
            <Text style={{ fontSize: 18 }}>{t('gameAttempts')}</Text>
            <Text style={{ fontSize: 18, marginBottom: 12 }}>
              {attemptCount}/{TOTAL_ATTEMPTS}
            </Text>

            <Text style={{ fontSize: 18 }}>{t('gameFound')}</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#16a34a', marginBottom: 12 }}>
              {foundCount}
            </Text>

            <Text style={{ fontSize: 18 }}>{t('gameMissed')}</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#dc2626', marginBottom: 20 }}>
              {missedCount}
            </Text>
          </View>

          <View
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              transform: [{ translateY: -70 }],
              alignItems: 'center',
              paddingHorizontal: 4,
            }}
          >
            {round.choices.map((note, idx) => {
              const isPicked = pickedNote !== null && samePitch(note, pickedNote);
              const isAnswer = samePitch(note, round.answerNote);
              let color = '#111';
              let fontWeight: '600' | '800' = '600';

              if (revealedWrong) {
                if (isAnswer) {
                  color = '#16a34a';
                  fontWeight = '800';
                } else if (isPicked && !isAnswer) {
                  color = '#dc2626';
                  fontWeight = '800';
                } else {
                  color = '#111';
                }
              } else if (pickedNote !== null && isPicked && isAnswer) {
                color = '#16a34a';
                fontWeight = '800';
              } else if (pickedNote !== null && isPicked && !isAnswer) {
                color = '#dc2626';
                fontWeight = '800';
              }

              const showThumb = pickedNote !== null && isPicked && isAnswer;
              const showSad = revealedWrong && isPicked && !isAnswer;

              return (
                <Pressable
                  key={`${idx}-${note}`}
                  disabled={pickedNote !== null || attemptCount >= TOTAL_ATTEMPTS}
                  onPress={() => onPickNote(note)}
                  style={{
                    marginBottom: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderRadius: 10,
                    backgroundColor: '#f0f0f2',
                    minWidth: 120,
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 20, fontWeight, color }}>{note}</Text>
                    {showThumb ? <Text style={{ fontSize: 22 }}>👍</Text> : null}
                    {showSad ? <Text style={{ fontSize: 22 }}>😞</Text> : null}
                  </View>
                </Pressable>
              );
            })}

            <Pressable
              onPress={onSuivant}
              disabled={attemptCount >= TOTAL_ATTEMPTS}
              style={{
                marginTop: 8,
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 10,
                backgroundColor: attemptCount >= TOTAL_ATTEMPTS ? '#9ca3af' : '#1f6feb',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 17, fontWeight: '700' }}>{t('next')}</Text>
            </Pressable>
          </View>

          {isGameFinished && (
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: 'center',
              }}
            >
              <Pressable
                onPress={resetFullGame}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: '#1f6feb',
                }}
              >
                <Text style={{ color: 'white', fontWeight: '700' }}>{t('playAgain')}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <Modal transparent visible={showEndDialog} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 14,
              paddingVertical: 22,
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ fontSize: 18, lineHeight: 26, marginBottom: 22, textAlign: 'center' }}>
              {encouragementForFound(uiLanguage, foundCount)}
            </Text>
            <Pressable
              onPress={() => setEndDialogDismissed(true)}
              style={{
                alignSelf: 'center',
                paddingVertical: 12,
                paddingHorizontal: 32,
                borderRadius: 10,
                backgroundColor: '#1f6feb',
              }}
            >
              <Text style={{ color: 'white', fontSize: 17, fontWeight: '700' }}>{t('ok')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
