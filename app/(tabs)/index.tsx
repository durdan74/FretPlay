import React, { useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

const numberOfStrings = 4;
const numberOfFrets = 12;

const notes = ['Do', 'Do#', 'Ré', 'Ré#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

// corde 1 = Sol
// corde 2 = Ré
// corde 3 = La
// corde 4 = Mi
const openStringNotes: Record<number, string> = {
  1: 'Sol',
  2: 'Ré',
  3: 'La',
  4: 'Mi',
};

function getNoteForPosition(stringNumber: number, fret: number): string {
  const openNote = openStringNotes[stringNumber];
  const startIndex = notes.indexOf(openNote);

  if (startIndex === -1) return 'Inconnue';

  return notes[(startIndex + fret) % 12];
}

function getClosestStringFromX(x: number, stringXs: number[]) {
  let closestIndex = 0;
  let closestDistance = Math.abs(x - stringXs[0]);

  for (let i = 1; i < stringXs.length; i++) {
    const distance = Math.abs(x - stringXs[i]);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }

  // 0 = Mi, 1 = La, 2 = Ré, 3 = Sol
  return 4 - closestIndex;
}

export default function Index() {
  const [availableHeight, setAvailableHeight] = useState(0);
  const [neckWidth, setNeckWidth] = useState(0);
  const [selectedString, setSelectedString] = useState<number | null>(null);
  const [selectedFret, setSelectedFret] = useState<number | null>(null);

  const handleMainLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setAvailableHeight(height);
  };

  const handleNeckLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setNeckWidth(width);
  };

  const neckContentHeight = availableHeight > 0 ? availableHeight * 1.5 : 900;
  const fretHeight = neckContentHeight / numberOfFrets;

  const sideInset = 17;
  const fretNumberColumnWidth = 32;

  const stringXs = useMemo(() => {
    if (neckWidth <= 0) return [0, 0, 0, 0];

    const usableWidth = neckWidth - sideInset * 2;
    const gap = usableWidth / (numberOfStrings - 1);

    return [
      sideInset,
      sideInset + gap,
      sideInset + gap * 2,
      sideInset + gap * 3,
    ];
  }, [neckWidth]);

  const handlePress = (x: number, y: number) => {
    if (neckWidth <= 0 || neckContentHeight <= 0) return;

    const fretIndex = Math.floor(y / fretHeight);

    if (fretIndex < 0 || fretIndex >= numberOfFrets) return;

    const stringNumber = getClosestStringFromX(x, stringXs);

    setSelectedString(stringNumber);
    setSelectedFret(fretIndex);
  };

  const selectedNote =
    selectedString !== null && selectedFret !== null
      ? getNoteForPosition(selectedString, selectedFret)
      : null;

  const selectedOpenString =
    selectedString !== null ? openStringNotes[selectedString] : null;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 16,
      }}
    >
      <View
        onLayout={handleMainLayout}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'stretch',
        }}
      >
        <View
          style={{
            width: '65%',
            marginRight: 16,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={true}
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
                  width: fretNumberColumnWidth,
                  height: neckContentHeight,
                  marginRight: 8,
                  position: 'relative',
                }}
              >
                {Array.from({ length: numberOfFrets }).map((_, fretIndex) => {
                  if (fretIndex === 0) {
                    return null;
                  }

                  return (
                    <View
                      key={`fret-number-${fretIndex}`}
                      style={{
                        position: 'absolute',
                        top: fretIndex * fretHeight - 10,
                        width: '100%',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: '600' }}>
                        {fretIndex - 1}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <Pressable
                onLayout={handleNeckLayout}
                onPress={(event) =>
                  handlePress(
                    event.nativeEvent.locationX,
                    event.nativeEvent.locationY
                  )
                }
                style={{
                  flex: 1,
                  height: neckContentHeight,
                  backgroundColor: '#d2a679',
                  position: 'relative',
                }}
              >
                {Array.from({ length: numberOfFrets }).map((_, fretIndex) => {
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
                const stringNumber = 4 - index;

                const widths = {
                  4: 6,
                  3: 5,
                  2: 4,
                  1: 2,
                };

                const stringWidth = widths[stringNumber as 1 | 2 | 3 | 4];

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
                {Array.from({ length: numberOfFrets + 1 }).map((_, fretIndex) => {
                  const top = fretIndex * fretHeight;

                  return (
                    <View
                      key={`fret-${fretIndex}`}
                      pointerEvents="none"
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top,
                        height: 3,
                        backgroundColor: 'grey',
                      }}
                    />
                  );
                })}

                {selectedString !== null && selectedFret !== null && neckWidth > 0 && (
                  <View
                    pointerEvents="none"
                    style={{
                      position: 'absolute',
                      left: stringXs[4 - selectedString] - 9,
                      top: selectedFret * fretHeight + fretHeight / 2 - 9,
                      width: 18,
                      height: 18,
                      borderRadius: 9,
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

        <View
          style={{
            width: '35%',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              marginBottom: 24,
            }}
          >
            {selectedNote ?? '—'}
          </Text>

          <Text style={{ fontSize: 20, marginBottom: 12 }}>
            {selectedString !== null ? `Corde : ${selectedString}` : 'Corde : —'}
          </Text>

          <Text style={{ fontSize: 20, marginBottom: 12 }}>
            {selectedOpenString ? `Corde à vide : ${selectedOpenString}` : 'Corde à vide : —'}
          </Text>

          <Text style={{ fontSize: 20, marginBottom: 12 }}>
            {selectedFret !== null ? `Frette : ${selectedFret}` : 'Frette : —'}
          </Text>

          <Text style={{ fontSize: 20 }}>
            {selectedNote ? `Note : ${selectedNote}` : 'Note : —'}
          </Text>
        </View>
      </View>
    </View>
  );
}