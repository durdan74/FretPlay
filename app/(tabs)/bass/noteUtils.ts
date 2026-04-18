import {
  CHROMATIC_SPELLINGS,
  CHROMATIC_SPELLINGS_EN,
  NOTE_TO_PITCH_CLASS,
  OPEN_STRING_NOTES,
  OPEN_STRING_NOTES_EN,
  type NotationSystem,
} from './constants';

export function getOpenStringLabel(stringNumber: number, notation: NotationSystem): string {
  const n = stringNumber as 1 | 2 | 3 | 4;
  return notation === 'european' ? OPEN_STRING_NOTES[n] : OPEN_STRING_NOTES_EN[n];
}

export function getPitchClass(noteName: string): number {
  const pc = NOTE_TO_PITCH_CLASS[noteName];
  if (pc === undefined) {
    throw new Error(`Note inconnue : ${noteName}`);
  }
  return pc;
}

export function samePitch(a: string, b: string): boolean {
  return getPitchClass(a) === getPitchClass(b);
}

export function getNoteForPosition(stringNumber: number, fret: number, notation: NotationSystem): string {
  const chromatic = (notation === 'european' ? CHROMATIC_SPELLINGS : CHROMATIC_SPELLINGS_EN) as readonly string[];
  const openMap = notation === 'european' ? OPEN_STRING_NOTES : OPEN_STRING_NOTES_EN;
  const openNote = openMap[stringNumber];
  const startIndex = chromatic.indexOf(openNote as string);

  if (startIndex === -1) return 'Inconnue';

  return chromatic[(startIndex + fret) % 12];
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
