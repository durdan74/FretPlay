import React, { useState } from 'react';
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
  const [targetNote, setTargetNote] = useState<string>(() => getRandomNote());
  const [foundCount, setFoundCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [feedback, setFeedback] = useState<string>('Trouve cette note sur la basse');

  const handleSelect = (stringNumber: number, fret: number) => {
    if (attemptCount >= TOTAL_ATTEMPTS) return;

    setSelectedString(stringNumber);
    setSelectedFret(fret);

    const playedNote = getNoteForPosition(stringNumber, fret);
    const isCorrect = playedNote === targetNote;

    setAttemptCount((prev) => prev + 1);

    if (isCorrect) {
      setFoundCount((prev) => prev + 1);
      setFeedback('Bravo ! Bonne note.');
      setTargetNote((prev) => getRandomNote(prev));
      return;
    }

    setMissedCount((prev) => prev + 1);
    setFeedback(`Raté : tu as joué ${playedNote}`);
  };

  const resetGame = () => {
    setSelectedString(null);
    setSelectedFret(null);
    setFoundCount(0);
    setMissedCount(0);
    setAttemptCount(0);
    setTargetNote(getRandomNote());
    setFeedback('Trouve cette note sur la basse');
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
        <BassNeck selectedString={selectedString} selectedFret={selectedFret} onSelect={handleSelect} />

        <View
          style={{
            width: '35%',
            justifyContent: 'center',
            paddingLeft: 8,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 8 }}>Note à trouver</Text>
          <Text style={{ fontSize: 42, fontWeight: '800', marginBottom: 16 }}>{targetNote}</Text>

          <Text style={{ fontSize: 18, marginBottom: 8 }}>
            Essais : {attemptCount}/{TOTAL_ATTEMPTS}
          </Text>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>Trouvées : {foundCount}</Text>
          <Text style={{ fontSize: 18, marginBottom: 16 }}>Ratées : {missedCount}</Text>

          <Text style={{ fontSize: 16, marginBottom: 16 }}>{feedback}</Text>

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
