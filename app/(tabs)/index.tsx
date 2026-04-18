import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 64,
        paddingBottom: 24,
        paddingHorizontal: 16,
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          alignItems: 'center',
          gap: 20,
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: '700' }}>Menu principal</Text>

        <Pressable
          onPress={() => router.push('/(tabs)/jeu-1')}
          style={{
            minWidth: 180,
            paddingVertical: 14,
            paddingHorizontal: 18,
            borderRadius: 12,
            backgroundColor: '#1f6feb',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 20, fontWeight: '700' }}>Jeu 1</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/(tabs)/jeu-2')}
          style={{
            minWidth: 180,
            paddingVertical: 14,
            paddingHorizontal: 18,
            borderRadius: 12,
            backgroundColor: '#1f6feb',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 20, fontWeight: '700' }}>Jeu 2</Text>
        </Pressable>
      </View>
    </View>
  );
}