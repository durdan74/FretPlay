import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BassNeck } from './bass/BassNeck';
import { NOTES } from './bass/constants';
import { getNoteForPosition } from './bass/noteUtils';

const TOTAL_ATTEMPTS = 10;

function getRandomNote(excluding?: string): string {
  const filteredNotes = excluding ? NOTES.filter((note) => note !== excluding) : NOTES;
  const randomIndex = Math.floor(Math.random() * filteredNotes.length);
  return filteredNotes[randomIndex];
}

export default function Jeu1Screen() {
  const [selectedString, setSelectedString] = useState<number | null>(null);
  const [selectedFret, setSelectedFret] = useState<number | null>(null);
  const [selectedResult, setSelectedResult] = useState<'correct' | 'wrong' | null>(null);
  const [targetNote, setTargetNote] = useState<string>(() => getRandomNote());
  const [foundCount, setFoundCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [resultEmoji, setResultEmoji] = useState<string | null>(null);
  const emojiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (emojiTimeoutRef.current) {
        clearTimeout(emojiTimeoutRef.current);
      }
    };
  }, []);

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

    const playedNote = getNoteForPosition(stringNumber, fret);
    const isCorrect = playedNote === targetNote;
    setSelectedResult(isCorrect ? 'correct' : 'wrong');
    showResultEmoji(isCorrect ? '👍' : '😬');

    setAttemptCount((prev) => prev + 1);

    if (isCorrect) {
      setFoundCount((prev) => prev + 1);
      setTargetNote((prev) => getRandomNote(prev));
      return;
    }

    setMissedCount((prev) => prev + 1);
  };

  const resetGame = () => {
    setSelectedString(null);
    setSelectedFret(null);
    setSelectedResult(null);
    setFoundCount(0);
    setMissedCount(0);
    setAttemptCount(0);
    setTargetNote(getRandomNote());
    setResultEmoji(null);
    if (emojiTimeoutRef.current) {
      clearTimeout(emojiTimeoutRef.current);
      emojiTimeoutRef.current = null;
    }
  };

  const isGameFinished = attemptCount >= TOTAL_ATTEMPTS;

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
          onSelect={handleSelect}
        />

        <View
          style={{
            width: '35%',
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
          <Text style={{ fontSize: 18, marginBottom: 12 }}>{foundCount}</Text>

          <Text style={{ fontSize: 18 }}>Ratées :</Text>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>{missedCount}</Text>

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
            <Pressable
              onPress={resetGame}
              style={{
                alignSelf: 'flex-start',
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 8,
                backgroundColor: '#1f6feb',
              }}
            >
              <Text style={{ color: 'white', fontWeight: '700' }}>Rejouer</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
