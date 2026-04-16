import React, { useMemo, useState } from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, Text, View } from 'react-native';

import {
  FRET_NUMBER_COLUMN_WIDTH,
  NUMBER_OF_FRETS,
  NUMBER_OF_STRINGS,
  SIDE_INSET,
  STRING_WIDTHS,
} from './constants';
import { getClosestStringFromX } from './noteUtils';

type BassNeckProps = {
  selectedString: number | null;
  selectedFret: number | null;
  onSelect: (stringNumber: number, fret: number) => void;
};

export function BassNeck({ selectedString, selectedFret, onSelect }: BassNeckProps) {
  const [availableHeight, setAvailableHeight] = useState(0);
  const [neckWidth, setNeckWidth] = useState(0);

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
    if (neckWidth <= 0 || neckContentHeight <= 0) return;

    const fretIndex = Math.floor(y / fretHeight);
    if (fretIndex < 0 || fretIndex >= NUMBER_OF_FRETS) return;

    const stringNumber = getClosestStringFromX(x, stringXs);
    onSelect(stringNumber, fretIndex);
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

            {['E', 'A', 'D', 'G'].map((label, index) => (
              <View
                key={`open-string-${label}`}
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
                <Text style={{ fontSize: 14, fontWeight: '700', color: 'white' }}>{label}</Text>
              </View>
            ))}

            {/* Reperes visuels: ronds centraux sur les frettes 3, 5, 7, 9 */}
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

            {/* Repere visuel: double point sur la frette 12 (1re et 3e case) */}
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

            {selectedString !== null && selectedFret !== null && neckWidth > 0 && (
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: stringXs[4 - selectedString] - 18,
                  top: selectedFret * fretHeight + fretHeight / 2 - 18,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#ffd966',
                  borderWidth: 2,
                  borderColor: 'black',
                }}
              />
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
