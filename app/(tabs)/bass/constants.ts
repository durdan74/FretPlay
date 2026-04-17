export const NUMBER_OF_STRINGS = 4;
export const NUMBER_OF_FRETS = 13;

export type NotationSystem = 'european' | 'anglo-saxon';

/** Ordre chromatique sur 12 demi-tons (corde ouverte + cases) — système européen. */
export const CHROMATIC_SPELLINGS = [
  'Do',
  'Do#',
  'Ré',
  'Ré#',
  'Mi',
  'Fa',
  'Fa#',
  'Sol',
  'Sol#',
  'La',
  'La#',
  'Si',
] as const;

export type ChromaticSpelling = (typeof CHROMATIC_SPELLINGS)[number];

/** Ordre chromatique — système anglo-saxon (lettres). */
export const CHROMATIC_SPELLINGS_EN = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

export type ChromaticSpellingEn = (typeof CHROMATIC_SPELLINGS_EN)[number];

/**
 * Notes affichées / tirées au hasard dans le jeu — système européen (enharmoniques).
 */
export const NOTES_FOR_GAME: string[] = [
  'Do',
  'Do#',
  'Réb',
  'Ré',
  'Ré#',
  'Mib',
  'Mi',
  'Fa',
  'Fa#',
  'Solb',
  'Sol',
  'Sol#',
  'Lab',
  'La',
  'La#',
  'Sib',
  'Si',
];

/**
 * Notes affichées / tirées au hasard — système anglo-saxon (enharmoniques).
 */
export const NOTES_FOR_GAME_EN: string[] = [
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
  'A',
  'A#',
  'Bb',
  'B',
];

/** Classe de hauteur 0 = Do/C … 11 = Si/B — toutes les graphies utilisées au jeu. */
export const NOTE_TO_PITCH_CLASS: Record<string, number> = {
  Do: 0,
  'Do#': 1,
  Réb: 1,
  Ré: 2,
  'Ré#': 3,
  Mib: 3,
  Mi: 4,
  Fa: 5,
  'Fa#': 6,
  Solb: 6,
  Sol: 7,
  'Sol#': 8,
  Lab: 8,
  La: 9,
  'La#': 10,
  Sib: 10,
  Si: 11,
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
};

export function getNotesPoolForNotation(notation: NotationSystem): string[] {
  return notation === 'european' ? NOTES_FOR_GAME : NOTES_FOR_GAME_EN;
}

// corde 1 = Sol / G
// corde 2 = Ré / D
// corde 3 = La / A
// corde 4 = Mi / E
export const OPEN_STRING_NOTES: Record<number, ChromaticSpelling> = {
  1: 'Sol',
  2: 'Ré',
  3: 'La',
  4: 'Mi',
};

export const OPEN_STRING_NOTES_EN: Record<number, ChromaticSpellingEn> = {
  1: 'G',
  2: 'D',
  3: 'A',
  4: 'E',
};

export const SIDE_INSET = 17;
export const FRET_NUMBER_COLUMN_WIDTH = 32;

export const STRING_WIDTHS: Record<1 | 2 | 3 | 4, number> = {
  4: 6,
  3: 5,
  2: 4,
  1: 2,
};
