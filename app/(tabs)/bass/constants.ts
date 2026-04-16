export const NUMBER_OF_STRINGS = 4;
export const NUMBER_OF_FRETS = 13;

export const NOTES = ['Do', 'Do#', 'Ré', 'Ré#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

// corde 1 = Sol
// corde 2 = Ré
// corde 3 = La
// corde 4 = Mi
export const OPEN_STRING_NOTES: Record<number, string> = {
  1: 'Sol',
  2: 'Ré',
  3: 'La',
  4: 'Mi',
};

export const SIDE_INSET = 17;
export const FRET_NUMBER_COLUMN_WIDTH = 32;

export const STRING_WIDTHS: Record<1 | 2 | 3 | 4, number> = {
  4: 6,
  3: 5,
  2: 4,
  1: 2,
};
