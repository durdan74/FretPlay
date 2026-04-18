import React from 'react';
import { Text, View } from 'react-native';

import type { GameScreenTheme } from '@/constants/gameScreen';

type StatBlockProps = {
  label: string;
  value: string | number;
  theme: GameScreenTheme;
  valueColor?: string;
};

export function StatBlock({ label, value, theme, valueColor }: StatBlockProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '700',
          color: theme.statLabel,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 22,
          fontWeight: '800',
          color: valueColor ?? theme.statValue,
          marginTop: 4,
          letterSpacing: -0.5,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
