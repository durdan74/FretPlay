import React from 'react';
import { Text, View } from 'react-native';

type SelectionInfoProps = {
  selectedNote: string | null;
  selectedString: number | null;
  selectedOpenString: string | null;
  selectedFret: number | null;
};

export function SelectionInfo({
  selectedNote,
  selectedString,
  selectedOpenString,
  selectedFret,
}: SelectionInfoProps) {
  return (
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

      <Text style={{ fontSize: 20 }}>{selectedNote ? `Note : ${selectedNote}` : 'Note : —'}</Text>
    </View>
  );
}
