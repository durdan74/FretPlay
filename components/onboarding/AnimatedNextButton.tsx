import React from 'react';

import { PrimaryButton } from './PrimaryButton';

export function AnimatedNextButton({
  onPress,
  title = 'Continuer',
  disabled,
}: {
  onPress: () => void;
  title?: string;
  disabled?: boolean;
}) {
  return <PrimaryButton title={title} disabled={disabled} onPress={onPress} />;
}
