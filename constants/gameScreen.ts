export const GAME_ACCENT = '#1f6feb';
export const GAME_FOUND = '#16a34a';
export const GAME_MISSED = '#dc2626';

export type GameScreenTheme = {
  pageBg: string;
  statLabel: string;
  statValue: string;
  stringHint: string;
  historiqueBtnBg: string;
  historiqueBtnText: string;
  modalCardBg: string;
  modalText: string;
  choiceChipBg: string;
  choiceChipBorder: string;
  panelBg: string;
  panelBorder: string;
};

export function getGameScreenTheme(isDark: boolean): GameScreenTheme {
  if (isDark) {
    return {
      pageBg: '#d8d3cd',
      statLabel: '#57534e',
      statValue: '#1c1917',
      stringHint: '#44403c',
      historiqueBtnBg: '#c4beb6',
      historiqueBtnText: '#1c1917',
      modalCardBg: '#f5f2ed',
      modalText: '#1c1917',
      choiceChipBg: '#e8e4de',
      choiceChipBorder: 'rgba(0,0,0,0.08)',
      panelBg: '#f0ebe4',
      panelBorder: 'rgba(0,0,0,0.1)',
    };
  }
  return {
    pageBg: '#faf7f4',
    statLabel: '#78716c',
    statValue: '#292524',
    stringHint: '#57534e',
    historiqueBtnBg: '#f0ebe4',
    historiqueBtnText: '#292524',
    modalCardBg: '#ffffff',
    modalText: '#1c1917',
    choiceChipBg: '#f5f0ea',
    choiceChipBorder: 'rgba(0,0,0,0.06)',
    panelBg: '#fffcf9',
    panelBorder: 'rgba(0,0,0,0.06)',
  };
}
