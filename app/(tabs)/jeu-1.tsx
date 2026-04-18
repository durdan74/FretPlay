import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { getNotesPoolForNotation } from '@/app/(tabs)/bass/constants';
import { getDefaultNotationFromLocale, useNotation } from '@/contexts/notation-context';

import { BassNeck } from './bass/BassNeck';
import { getNoteForPosition, samePitch } from './bass/noteUtils';

const TOTAL_ATTEMPTS = 10;

function getRandomNote(pool: string[], excluding?: string): string {
  const filtered =
    excluding !== undefined ? pool.filter((note) => !samePitch(note, excluding)) : pool;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

function getScoreEncouragementMessage(found: number): string {
  if (found <= 1) {
    return 'Tu ne peux que progresser ! Allez ! Courage ! Continue à jouer !';
  }
  if (found <= 4) {
    return 'Ca avance, continue pour progresser';
  }
  if (found <= 7) {
    return "Pas mal ! Continue pour t'améliorer";
  }
  if (found <= 9) {
    return 'Génial, encore un petit effort et tu es au!';
  }
  return 'Bravo, tu connais parfaitement tes notes ! Continue pour confirmer.';
}

export default function Jeu1Screen() {
  const { notation, isHydrated } = useNotation();
  const notesPool = useMemo(() => getNotesPoolForNotation(notation), [notation]);

  const [selectedString, setSelectedString] = useState<number | null>(null);
  const [selectedFret, setSelectedFret] = useState<number | null>(null);
  const [selectedResult, setSelectedResult] = useState<'correct' | 'wrong' | null>(null);
  const [wrongPlayedNote, setWrongPlayedNote] = useState<string | null>(null);
  const [targetNote, setTargetNote] = useState<string>(() =>
    getRandomNote(getNotesPoolForNotation(getDefaultNotationFromLocale())),
  );
  const [foundCount, setFoundCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [resultEmoji, setResultEmoji] = useState<string | null>(null);
  const [endDialogDismissed, setEndDialogDismissed] = useState(false);
  const emojiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasHydratedRef = useRef(false);
  const lastNotationRef = useRef(notation);

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
    setTargetNote(getRandomNote(notesPool));
    setResultEmoji(null);
    setEndDialogDismissed(false);
    if (emojiTimeoutRef.current) {
      clearTimeout(emojiTimeoutRef.current);
      emojiTimeoutRef.current = null;
    }
  }, [notesPool]);

  useEffect(() => {
    if (!isHydrated) return;

    if (!wasHydratedRef.current) {
      wasHydratedRef.current = true;
      if (getDefaultNotationFromLocale() !== notation) {
        resetGame();
      }
      lastNotationRef.current = notation;
      return;
    }

    if (lastNotationRef.current !== notation) {
      resetGame();
      lastNotationRef.current = notation;
    }
  }, [isHydrated, notation, resetGame]);

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

    setSelectedString(stringNumber);
    setSelectedFret(fret);

    const playedNote = getNoteForPosition(stringNumber, fret, notation);
    const isCorrect = samePitch(playedNote, targetNote);
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
      setTargetNote((prev) => getRandomNote(notesPool, prev));
      return;
    }

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setMissedCount((prev) => prev + 1);
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
            paddingTop: 24,
            position: 'relative',
          }}
        >
          <Text style={{ fontSize: 18 }}>Essais :</Text>
          <Text style={{ fontSize: 18, marginBottom: 12 }}>
            {attemptCount}/{TOTAL_ATTEMPTS}
          </Text>

          <Text style={{ fontSize: 18 }}>Trouvées :</Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#16a34a', marginBottom: 12 }}>
            {foundCount}
          </Text>

          <Text style={{ fontSize: 18 }}>Ratées :</Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#dc2626', marginBottom: 20 }}>
            {missedCount}
          </Text>

          <View
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              transform: [{ translateY: -21 }],
              alignItems: 'center',
            }}
          >
            <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontSize: 42, fontWeight: '800' }}>
              {targetNote}
            </Text>
          </View>

          {resultEmoji && (
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: 8,
                right: 0,
                transform: [{ translateY: 44 }],
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
                <Text style={{ color: 'white', fontWeight: '700' }}>Rejouer</Text>
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
              {getScoreEncouragementMessage(foundCount)}
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
              <Text style={{ color: 'white', fontSize: 17, fontWeight: '700' }}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
