import { router, type Href } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { NotationSystem } from '@/app/(tabs)/bass/constants';
import { useNotation } from '@/contexts/notation-context';

import { useParametresReturn } from './parametres-return-context';

function RadioRow({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: selected ? '#1f6feb' : '#888',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected ? (
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: '#1f6feb',
            }}
          />
        ) : null}
      </View>
      <Text style={{ fontSize: 17 }}>{label}</Text>
    </Pressable>
  );
}

function CheckRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: checked ? '#1f6feb' : '#888',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: checked ? '#e8f0fe' : 'transparent',
        }}
      >
        {checked ? (
          <Text style={{ fontSize: 14, fontWeight: '900', color: '#1f6feb' }}>✓</Text>
        ) : null}
      </View>
      <Text style={{ fontSize: 17, flex: 1 }}>{label}</Text>
    </Pressable>
  );
}

export default function ParametresScreen() {
  const { returnTab } = useParametresReturn();
  const { notation, setNotation, indicateString, setIndicateString } = useNotation();

  const handleRetour = () => {
    const href: Href = returnTab === 'index' ? '/(tabs)' : '/(tabs)/jeu-1';
    router.navigate(href);
  };

  const setSystem = (value: NotationSystem) => {
    setNotation(value);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 64,
        paddingBottom: 24,
        paddingHorizontal: 16,
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 12 }}>Paramètres</Text>

      <Text style={{ fontSize: 17, fontWeight: '600', marginBottom: 8 }}>Notation des notes</Text>
      <Text style={{ fontSize: 14, color: '#555', marginBottom: 12 }}>
        Par défaut, le choix suit la langue du téléphone (anglais → anglo-saxon, sinon européen). Tu peux
        forcer l’un ou l’autre ci-dessous.
      </Text>

      <View style={{ marginBottom: 28 }}>
        <RadioRow
          label="Système européen (Do, Ré, Mi…)"
          selected={notation === 'european'}
          onSelect={() => setSystem('european')}
        />
        <RadioRow
          label="Système anglo-saxon (A, B, C…)"
          selected={notation === 'anglo-saxon'}
          onSelect={() => setSystem('anglo-saxon')}
        />
      </View>

      <Text style={{ fontSize: 17, fontWeight: '600', marginBottom: 8 }}>Difficulté</Text>
      <Text style={{ fontSize: 14, color: '#555', marginBottom: 10 }}>
        Si activé, la note doit être jouée sur la corde indiquée : la même hauteur sur une autre corde est
        considérée comme une erreur.
      </Text>
      <View style={{ marginBottom: 28 }}>
        <CheckRow
          label="Indiquer la corde"
          checked={indicateString}
          onToggle={() => setIndicateString(!indicateString)}
        />
      </View>

      <Pressable
        onPress={handleRetour}
        style={{
          alignSelf: 'flex-start',
          paddingVertical: 12,
          paddingHorizontal: 18,
          borderRadius: 10,
          backgroundColor: '#1f6feb',
        }}
      >
        <Text style={{ color: 'white', fontSize: 17, fontWeight: '700' }}>Retour</Text>
      </Pressable>
    </View>
  );
}
