import * as Haptics from 'expo-haptics';
import { router, type Href } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getNotesPoolForNotation, NUMBER_OF_FRETS, type NotationSystem } from '@/app/(tabs)/bass/constants';
import { StatBlock } from '@/components/game/StatBlock';
import { GAME_ACCENT, GAME_FOUND, GAME_MISSED, getGameScreenTheme } from '@/constants/gameScreen';
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
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = useMemo(() => getGameScreenTheme(isDark), [isDark]);

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
        backgroundColor: theme.pageBg,
        paddingTop: Math.max(insets.top, 10) + 4,
        paddingBottom: Math.max(insets.bottom, 12),
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
            paddingLeft: 8,
            paddingTop: 4,
            position: 'relative',
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: theme.panelBg,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: theme.panelBorder,
              paddingHorizontal: 10,
              paddingTop: 10,
              paddingBottom: 10,
              position: 'relative',
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8, width: '100%' }}>
              <Pressable
                onPress={() => router.push('/(tabs)/historique?jeu=jeu-2' as Href)}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 8,
                  borderRadius: 8,
                  backgroundColor: theme.historiqueBtnBg,
                  maxWidth: '100%',
                }}
              >
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.65}
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: theme.historiqueBtnText,
                    maxWidth: 118,
                  }}
                >
                  {t('historique')}
                </Text>
              </Pressable>
            </View>

            <View style={{ marginTop: 6, marginBottom: 8 }}>
              <StatBlock label={t('gameAttempts')} value={`${attemptCount}/${TOTAL_ATTEMPTS}`} theme={theme} />
              <StatBlock label={t('gameFound')} value={foundCount} theme={theme} valueColor={GAME_FOUND} />
              <StatBlock label={t('gameMissed')} value={missedCount} theme={theme} valueColor={GAME_MISSED} />
            </View>

            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: 6,
                right: 6,
                transform: [{ translateY: -72 }],
                alignItems: 'center',
                paddingHorizontal: 2,
              }}
            >
              {round.choices.map((note, idx) => {
                const isPicked = pickedNote !== null && samePitch(note, pickedNote);
                const isAnswer = samePitch(note, round.answerNote);
                let color = theme.statValue;
                let fontWeight: '600' | '800' = '600';

                if (revealedWrong) {
                  if (isAnswer) {
                    color = GAME_FOUND;
                    fontWeight = '800';
                  } else if (isPicked && !isAnswer) {
                    color = GAME_MISSED;
                    fontWeight = '800';
                  } else {
                    color = theme.statValue;
                  }
                } else if (pickedNote !== null && isPicked && isAnswer) {
                  color = GAME_FOUND;
                  fontWeight = '800';
                } else if (pickedNote !== null && isPicked && !isAnswer) {
                  color = GAME_MISSED;
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
                      paddingHorizontal: 12,
                      borderRadius: 12,
                      backgroundColor: theme.choiceChipBg,
                      borderWidth: 1,
                      borderColor: theme.choiceChipBorder,
                      minWidth: 118,
                      alignItems: 'center',
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ fontSize: 19, fontWeight, color }}>{note}</Text>
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
                  marginTop: 18,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  backgroundColor: attemptCount >= TOTAL_ATTEMPTS ? '#9ca3af' : GAME_ACCENT,
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 118,
                  width: 118,
                  maxWidth: '100%',
                }}
              >
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.55}
                  style={{
                    color: 'white',
                    fontSize: 19,
                    fontWeight: '700',
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  {t('next')}
                </Text>
              </Pressable>
            </View>

            {isGameFinished && (
              <View
                style={{
                  position: 'absolute',
                  left: 6,
                  right: 6,
                  bottom: 10,
                  alignItems: 'center',
                }}
              >
                <Pressable
                  onPress={resetFullGame}
                  style={{
                    paddingVertical: 11,
                    paddingHorizontal: 18,
                    borderRadius: 10,
                    backgroundColor: GAME_ACCENT,
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>{t('playAgain')}</Text>
                </Pressable>
              </View>
            )}
          </View>
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
              backgroundColor: theme.modalCardBg,
              borderRadius: 14,
              paddingVertical: 22,
              paddingHorizontal: 20,
              borderWidth: isDark ? 1 : 0,
              borderColor: theme.panelBorder,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                lineHeight: 25,
                marginBottom: 22,
                textAlign: 'center',
                color: theme.modalText,
              }}
            >
              {encouragementForFound(uiLanguage, foundCount)}
            </Text>
            <Pressable
              onPress={() => setEndDialogDismissed(true)}
              style={{
                alignSelf: 'center',
                paddingVertical: 12,
                paddingHorizontal: 32,
                borderRadius: 10,
                backgroundColor: GAME_ACCENT,
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
