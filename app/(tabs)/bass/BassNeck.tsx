import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, Text, View } from 'react-native';

import { useNotation } from '@/contexts/notation-context';

import {
  FRET_NUMBER_COLUMN_WIDTH,
  NUMBER_OF_FRETS,
  NUMBER_OF_STRINGS,
  OPEN_STRING_NOTES,
  OPEN_STRING_NOTES_EN,
  SIDE_INSET,
  STRING_WIDTHS,
} from './constants';
import { getClosestStringFromX } from './noteUtils';

/** Ordre d’affichage gauche → droite : corde 4 (grave) … corde 1 (aiguë), comme `stringXs`. */
const OPEN_STRING_DISPLAY_ORDER = [4, 3, 2, 1] as const;

const SELECTION_MARKER_SIZE = 46;
const SELECTION_MARKER_HALF = SELECTION_MARKER_SIZE / 2;

const ANSWER_MARKER_SIZE = 40;
const ANSWER_MARKER_HALF = ANSWER_MARKER_SIZE / 2;

export type AnswerMarkerPosition = {
  stringNum: number;
  fret: number;
};

type BassNeckProps = {
  selectedString: number | null;
  selectedFret: number | null;
  selectedResult: 'correct' | 'wrong' | null;
  /** Note réellement jouée (même graphie que la notation), affichée dans le rond si faux. */
  wrongPlayedNote: string | null;
  onSelect: (stringNumber: number, fret: number) => void;
  /** Si false, le manche ne réagit pas au tap (« Trouve la case »). Défaut : true. */
  neckInteractive?: boolean;
  /** Point vert : position de la note à identifier (« Trouve la case »). */
  answerMarker?: AnswerMarkerPosition | null;
};

export function BassNeck({
  selectedString,
  selectedFret,
  selectedResult,
  wrongPlayedNote,
  onSelect,
  neckInteractive = true,
  answerMarker = null,
}: BassNeckProps) {
  const { notation } = useNotation();
  const [availableHeight, setAvailableHeight] = useState(0);
  const [neckWidth, setNeckWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const openStringLabels = useMemo(
    () =>
      OPEN_STRING_DISPLAY_ORDER.map((stringNum) =>
        notation === 'european' ? OPEN_STRING_NOTES[stringNum] : OPEN_STRING_NOTES_EN[stringNum],
      ),
    [notation],
  );

  const handleMainLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setAvailableHeight(height);
  };

  const handleNeckLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setNeckWidth(width);
  };

  const neckContentHeight = availableHeight > 0 ? availableHeight * 1.5 : 900;
  const fretHeight = neckContentHeight / NUMBER_OF_FRETS;

  const stringXs = useMemo(() => {
    if (neckWidth <= 0) return [0, 0, 0, 0];

    const usableWidth = neckWidth - SIDE_INSET * 2;
    const gap = usableWidth / (NUMBER_OF_STRINGS - 1);

    return [SIDE_INSET, SIDE_INSET + gap, SIDE_INSET + gap * 2, SIDE_INSET + gap * 3];
  }, [neckWidth]);

  const handlePress = (x: number, y: number) => {
    if (!neckInteractive) return;
    if (neckWidth <= 0 || neckContentHeight <= 0) return;

    const fretIndex = Math.floor(y / fretHeight);
    if (fretIndex < 0 || fretIndex >= NUMBER_OF_FRETS) return;

    const stringNumber = getClosestStringFromX(x, stringXs);
    onSelect(stringNumber, fretIndex);
  };

  const answerMarkerKey =
    answerMarker !== null ? `${answerMarker.stringNum}-${answerMarker.fret}` : null;

  useEffect(() => {
    if (answerMarkerKey === null || viewportHeight <= 0 || fretHeight <= 0) return;

    const fret = answerMarker!.fret;
    const dotCenterY = fret * fretHeight + fretHeight / 2;
    const maxScroll = Math.max(0, neckContentHeight - viewportHeight);
    const targetY = Math.min(maxScroll, Math.max(0, dotCenterY - viewportHeight / 2));

    const id = requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: targetY, animated: true });
    });
    return () => cancelAnimationFrame(id);
  }, [answerMarkerKey, viewportHeight, neckContentHeight, fretHeight, answerMarker]);

  const neckInner = (
    <>
      {Array.from({ length: NUMBER_OF_FRETS }).map((_, fretIndex) => {
        const top = fretIndex * fretHeight;
        const isLightRow = fretIndex === 0;

        return (
          <View
            key={`fret-bg-${fretIndex}`}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top,
              height: fretHeight,
              backgroundColor: isLightRow ? '#e7c9a5' : '#d2a679',
            }}
          />
        );
      })}

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          backgroundColor: 'black',
        }}
      />

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 6,
          backgroundColor: 'black',
        }}
      />

      {stringXs.map((x, index) => {
        const stringNumber = (4 - index) as 1 | 2 | 3 | 4;
        const stringWidth = STRING_WIDTHS[stringNumber];

        return (
          <View
            key={`string-${index}`}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: x - stringWidth / 2,
              top: 0,
              bottom: 0,
              width: stringWidth,
              backgroundColor: '#666',
            }}
          />
        );
      })}

      {Array.from({ length: NUMBER_OF_FRETS + 1 }).map((_, fretIndex) => {
        const top = fretIndex * fretHeight;
        const isZeroFret = fretIndex === 1;

        return (
          <View
            key={`fret-${fretIndex}`}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top,
              height: isZeroFret ? 6 : 3,
              backgroundColor: isZeroFret ? 'white' : 'grey',
            }}
          />
        );
      })}

      {openStringLabels.map((label, index) => (
        <View
          key={`open-string-${index}`}
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: stringXs[index] - 14,
            top: fretHeight / 2 - 30,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: '#d92d20',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.65}
            style={{ fontSize: 14, fontWeight: '700', color: 'white', maxWidth: 26, textAlign: 'center' }}
          >
            {label}
          </Text>
        </View>
      ))}

      {[3, 5, 7, 9].map((fretMarker) => (
        <View
          key={`marker-${fretMarker}`}
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: '50%',
            top: fretMarker * fretHeight + fretHeight / 2 - 12,
            width: 24,
            height: 24,
            marginLeft: -12,
            borderRadius: 12,
            backgroundColor: '#8b6b47',
          }}
        />
      ))}

      {[
        (stringXs[0] + stringXs[1]) / 2,
        (stringXs[2] + stringXs[3]) / 2,
      ].map((markerX, index) => (
        <View
          key={`marker-12-${index}`}
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: markerX - 12,
            top: 12 * fretHeight + fretHeight / 2 - 12,
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#8b6b47',
          }}
        />
      ))}

      {answerMarker !== null && neckWidth > 0 && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: stringXs[4 - answerMarker.stringNum] - ANSWER_MARKER_HALF,
            top: answerMarker.fret * fretHeight + fretHeight / 2 - ANSWER_MARKER_HALF,
            width: ANSWER_MARKER_SIZE,
            height: ANSWER_MARKER_SIZE,
            borderRadius: ANSWER_MARKER_HALF,
            backgroundColor: '#22c55e',
            borderWidth: 2,
            borderColor: '#14532d',
          }}
        />
      )}

      {selectedString !== null && selectedFret !== null && neckWidth > 0 && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: stringXs[4 - selectedString] - SELECTION_MARKER_HALF,
            top: selectedFret * fretHeight + fretHeight / 2 - SELECTION_MARKER_HALF,
            width: SELECTION_MARKER_SIZE,
            height: SELECTION_MARKER_SIZE,
            borderRadius: SELECTION_MARKER_HALF,
            backgroundColor: selectedResult === 'correct' ? '#22c55e' : '#ef4444',
            borderWidth: 2,
            borderColor: 'black',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {selectedResult === 'wrong' && wrongPlayedNote ? (
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.45}
              style={{
                color: 'white',
                fontWeight: '800',
                fontSize: 15,
                maxWidth: SELECTION_MARKER_SIZE - 8,
                textAlign: 'center',
                paddingHorizontal: 2,
              }}
            >
              {wrongPlayedNote}
            </Text>
          ) : null}
        </View>
      )}
    </>
  );

  const onScrollViewLayout = (event: LayoutChangeEvent) => {
    setViewportHeight(event.nativeEvent.layout.height);
  };

  return (
    <View
      onLayout={handleMainLayout}
      style={{
        width: '65%',
        marginRight: 16,
      }}
    >
      <ScrollView
        ref={scrollRef}
        onLayout={onScrollViewLayout}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: neckContentHeight,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            minHeight: neckContentHeight,
          }}
        >
          <View
            style={{
              width: FRET_NUMBER_COLUMN_WIDTH,
              height: neckContentHeight,
              marginRight: 8,
              position: 'relative',
            }}
          >
            {Array.from({ length: NUMBER_OF_FRETS }).map((_, fretIndex) => {
              return (
                <View
                  key={`fret-number-${fretIndex}`}
                  style={{
                    position: 'absolute',
                    top: (fretIndex + 0.5) * fretHeight - 10,
                    width: '100%',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>{fretIndex}</Text>
                </View>
              );
            })}
          </View>

          {neckInteractive ? (
            <Pressable
              onLayout={handleNeckLayout}
              onPress={(event) => handlePress(event.nativeEvent.locationX, event.nativeEvent.locationY)}
              style={{
                flex: 1,
                height: neckContentHeight,
                backgroundColor: '#d2a679',
                position: 'relative',
              }}
            >
              {neckInner}
            </Pressable>
          ) : (
            <View
              onLayout={handleNeckLayout}
              style={{
                flex: 1,
                height: neckContentHeight,
                backgroundColor: '#d2a679',
                position: 'relative',
              }}
            >
              {neckInner}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
