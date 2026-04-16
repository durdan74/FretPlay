import { NOTES, OPEN_STRING_NOTES } from './constants';

export function getNoteForPosition(stringNumber: number, fret: number): string {
  const openNote = OPEN_STRING_NOTES[stringNumber];
  const startIndex = NOTES.indexOf(openNote);

  if (startIndex === -1) return 'Inconnue';

  return NOTES[(startIndex + fret) % 12];
}

export function getClosestStringFromX(x: number, stringXs: number[]): number {
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
