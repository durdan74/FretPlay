import * as Haptics from 'expo-haptics';
import { router, type Href } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  getNotesPoolForNotation,
  NUMBER_OF_FRETS,
  type NotationSystem,
} from '@/app/(tabs)/bass/constants';
import { StatBlock } from '@/components/game/StatBlock';
import { GAME_ACCENT, GAME_FOUND, GAME_MISSED, getGameScreenTheme } from '@/constants/gameScreen';
import { useNotation } from '@/contexts/notation-context';
import { usePurchases } from '@/contexts/purchases-context';
import { encouragementForFound } from '@/lib/i18n/strings';
import { fillTemplate } from '@/lib/i18n/template';
import { appendGameSession } from '@/storage/gameHistory';
import { FREE_PLAY_LIMIT, getPaywallAccessState, incrementFreeSessionUsed } from '@/storage/paywallAccess';

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
  const { isEntitled } = usePurchases();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = useMemo(() => getGameScreenTheme(isDark), [isDark]);
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

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (isEntitled) return;
      const access = await getPaywallAccessState();
      if (!cancelled && !access.locallyUnlocked && access.freeSessionsUsed >= FREE_PLAY_LIMIT) {
        router.replace('/paywall');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isEntitled]);

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
      void (async () => {
        await appendGameSession({
          playedAt: new Date(endedAt).toISOString(),
          notation,
          attempts: TOTAL_ATTEMPTS,
          found: nextFound,
          missed: nextMissed,
          durationMs: Math.max(0, endedAt - startedAt),
          gameKind: 'jeu-1',
        });
        if (!isEntitled) {
          const access = await getPaywallAccessState();
          if (!access.locallyUnlocked) {
            await incrementFreeSessionUsed();
          }
        }
      })();
    }
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
                onPress={() => router.push('/(tabs)/historique?jeu=jeu-1' as Href)}
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
                left: 8,
                right: 8,
                transform: [{ translateY: indicateString ? -32 : -21 }],
                alignItems: 'center',
              }}
            >
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize: indicateString ? 34 : 42,
                  fontWeight: '800',
                  textAlign: 'center',
                  color: theme.statValue,
                }}
              >
                {targetNote}
              </Text>
              {indicateString && targetStringNum !== null ? (
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: theme.stringHint,
                    marginTop: 6,
                    textAlign: 'center',
                  }}
                >
                  {fillTemplate(t('jeu1StringLine'), { note: getOpenStringLabel(targetStringNum, notation) })}
                </Text>
              ) : null}
            </View>

            {resultEmoji && (
              <View
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 4,
                  right: 4,
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
                  left: 6,
                  right: 6,
                  bottom: 10,
                  alignItems: 'center',
                }}
              >
                <Pressable
                  onPress={() => {
                    void (async () => {
                      if (isEntitled) {
                        resetGame();
                        return;
                      }
                      const access = await getPaywallAccessState();
                      if (!access.locallyUnlocked && access.freeSessionsUsed >= FREE_PLAY_LIMIT) {
                        router.replace('/paywall');
                        return;
                      }
                      resetGame();
                    })();
                  }}
                  style={{
                    alignSelf: 'stretch',
                    paddingVertical: 11,
                    paddingHorizontal: 12,
                    borderRadius: 10,
                    backgroundColor: GAME_ACCENT,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.55}
                    style={{
                      color: 'white',
                      fontWeight: '700',
                      fontSize: 16,
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    {t('playAgain')}
                  </Text>
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
