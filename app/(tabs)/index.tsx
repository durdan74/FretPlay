import React, { useState } from 'react';
import { View } from 'react-native';

import { BassNeck } from './bass/BassNeck';
import { OPEN_STRING_NOTES } from './bass/constants';
import { getNoteForPosition } from './bass/noteUtils';
import { SelectionInfo } from './bass/SelectionInfo';

export default function Index() {
  const [selectedString, setSelectedString] = useState<number | null>(null);
  const [selectedFret, setSelectedFret] = useState<number | null>(null);

  const handleSelect = (stringNumber: number, fret: number) => {
    setSelectedString(stringNumber);
    setSelectedFret(fret);
  };

  const selectedNote =
    selectedString !== null && selectedFret !== null
      ? getNoteForPosition(selectedString, selectedFret)
      : null;

  const selectedOpenString =
    selectedString !== null ? OPEN_STRING_NOTES[selectedString] : null;

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
        <SelectionInfo
          selectedNote={selectedNote}
          selectedString={selectedString}
          selectedOpenString={selectedOpenString}
          selectedFret={selectedFret}
        />
      </View>
    </View>
  );
}