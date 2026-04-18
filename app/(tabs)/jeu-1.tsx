import * as Haptics from 'expo-haptics';
import { router, type Href } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import {
  getNotesPoolForNotation,
  NUMBER_OF_FRETS,
  type NotationSystem,
} from '@/app/(tabs)/bass/constants';
import { useNotation } from '@/contexts/notation-context';
import { fillTemplate } from '@/lib/i18n/template';
import { encouragementForFound } from '@/lib/i18n/strings';
import { appendGameSession } from '@/storage/gameHistory';

import { BassNeck } from './bass/BassNeck';
import { getNoteForPosition, getOpenStringLabel, samePitch } from './bass/noteUtils';

const TOTAL_ATTEMPTS = 10;

function getRandomNote(pool: string[], excluding?: string): string {
  const filtered =
    excluding !== undefined ? pool.filter((note) => !samePitch(note, excluding)) : pool;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

function pickRandomStringTarget(
  notation: NotationSystem,
  exclude?: { note: string; stringNum: number },
): { note: string; stringNum: number } {
  const strings = [1, 2, 3, 4] as const;
  for (let attempt = 0; attempt < 120; attempt++) {
    const stringNum = strings[Math.floor(Math.random() * 4)]!;
    const fret = Math.floor(Math.random() * NUMBER_OF_FRETS);
    const note = getNoteForPosition(stringNum, fret, notation);
    if (exclude && samePitch(note, exclude.note) && stringNum === exclude.stringNum) {
      continue;
    }
    return { note, stringNum };
  }
  return { note: getNoteForPosition(4, 0, notation), stringNum: 4 };
}

export default function Jeu1Screen() {
  const { notation, isHydrated, indicateString, t, uiLanguage } = useNotation();
  const notesPool = useMemo(() => getNotesPoolForNotation(notation), [notation]);

  const [selectedString, setSelectedString] = useState<number | null>(null);
  const [selectedFret, setSelectedFret] = useState<number | null>(null);
  const [selectedResult, setSelectedResult] = useState<'correct' | 'wrong' | null>(null);
  const [wrongPlayedNote, setWrongPlayedNote] = useState<string | null>(null);
  const [targetNote, setTargetNote] = useState<string>('Do');
  const [targetStringNum, setTargetStringNum] = useState<number | null>(null);
  const [foundCount, setFoundCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [resultEmoji, setResultEmoji] = useState<string | null>(null);
  const [endDialogDismissed, setEndDialogDismissed] = useState(false);
  const emojiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasHydratedRef = useRef(false);
  const lastNotationRef = useRef(notation);
  const lastIndicateStringRef = useRef(indicateString);
  /** Horodatage du 1er essai de la partie en cours (pour `durationMs`). */
  const gameStartedAtRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (emojiTimeoutRef.current) {
        clearTimeout(emojiTimeoutRef.current);
      }
    };
  }, []);

  const resetGame = useCallback(() => {
    setSelectedString(null);
    setSelectedFret(null);
    setSelectedResult(null);
    setWrongPlayedNote(null);
    setFoundCount(0);
    setMissedCount(0);
    setAttemptCount(0);
    if (indicateString) {
      const nextTarget = pickRandomStringTarget(notation);
      setTargetNote(nextTarget.note);
      setTargetStringNum(nextTarget.stringNum);
    } else {
      setTargetStringNum(null);
      setTargetNote(getRandomNote(notesPool));
    }
    setResultEmoji(null);
    setEndDialogDismissed(false);
    gameStartedAtRef.current = null;
    if (emojiTimeoutRef.current) {
      clearTimeout(emojiTimeoutRef.current);
      emojiTimeoutRef.current = null;
    }
  }, [notesPool, indicateString, notation]);

  useEffect(() => {
    if (!isHydrated) return;

    if (!wasHydratedRef.current) {
      wasHydratedRef.current = true;
      resetGame();
      lastNotationRef.current = notation;
      lastIndicateStringRef.current = indicateString;
      return;
    }

    if (lastNotationRef.current !== notation) {
      resetGame();
      lastNotationRef.current = notation;
    }
    if (lastIndicateStringRef.current !== indicateString) {
      resetGame();
      lastIndicateStringRef.current = indicateString;
    }
  }, [isHydrated, notation, indicateString, resetGame]);

  const showResultEmoji = (emoji: string) => {
    if (emojiTimeoutRef.current) {
      clearTimeout(emojiTimeoutRef.current);
    }
    setResultEmoji(emoji);
    emojiTimeoutRef.current = setTimeout(() => {
      setResultEmoji(null);
      emojiTimeoutRef.current = null;
    }, 2000);
  };

  const handleSelect = (stringNumber: number, fret: number) => {
    if (attemptCount >= TOTAL_ATTEMPTS) return;

    if (attemptCount === 0) {
      gameStartedAtRef.current = Date.now();
    }

    const nextAttempt = attemptCount + 1;
    const playedNote = getNoteForPosition(stringNumber, fret, notation);
    const noteOk = samePitch(playedNote, targetNote);
    const stringOk =
      !indicateString || targetStringNum === null ? true : stringNumber === targetStringNum;
    const isCorrect = noteOk && stringOk;
    const nextFound = isCorrect ? foundCount + 1 : foundCount;
    const nextMissed = isCorrect ? missedCount : missedCount + 1;

    setSelectedString(stringNumber);
    setSelectedFret(fret);
    setSelectedResult(isCorrect ? 'correct' : 'wrong');
    showResultEmoji(isCorrect ? '👍' : '😬');

    if (isCorrect) {
      setWrongPlayedNote(null);
    } else {
      setWrongPlayedNote(playedNote);
    }

    setAttemptCount((prev) => prev + 1);

    if (isCorrect) {
      setFoundCount((prev) => prev + 1);
      if (indicateString && targetStringNum !== null) {
        const nextTarget = pickRandomStringTarget(notation, { note: targetNote, stringNum: targetStringNum });
        setTargetNote(nextTarget.note);
        setTargetStringNum(nextTarget.stringNum);
      } else {
        setTargetNote((prev) => getRandomNote(notesPool, prev));
      }
    } else {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setMissedCount((prev) => prev + 1);
    }

    if (nextAttempt === TOTAL_ATTEMPTS) {
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
        gameKind: 'jeu-1',
      });
    }
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
          selectedString={selectedString}
          selectedFret={selectedFret}
          selectedResult={selectedResult}
          wrongPlayedNote={wrongPlayedNote}
          onSelect={handleSelect}
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
              onPress={() => router.push('/(tabs)/historique?jeu=jeu-1' as Href)}
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
              transform: [{ translateY: indicateString ? -32 : -21 }],
              alignItems: 'center',
              paddingHorizontal: 4,
            }}
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{ fontSize: indicateString ? 34 : 42, fontWeight: '800', textAlign: 'center' }}
            >
              {targetNote}
            </Text>
            {indicateString && targetStringNum !== null ? (
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginTop: 6, textAlign: 'center' }}>
                {fillTemplate(t('jeu1StringLine'), { note: getOpenStringLabel(targetStringNum, notation) })}
              </Text>
            ) : null}
          </View>

          {resultEmoji && (
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: 8,
                right: 0,
                transform: [{ translateY: indicateString ? 52 : 44 }],
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 34 }}>{resultEmoji}</Text>
            </View>
          )}

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
                onPress={resetGame}
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
