export type OnboardingPalette = {
  accentStrong: string;
  accentSoft: string;
  accentMid: string;
  accentTint: string;
  borderIdle: string;
  borderActive: string;
  indicatorIdle: string;
  title: string;
  text: string;
  textSecondary: string;
  progressTrack: string;
};

export const ONBOARDING_PALETTES: Record<'A' | 'B' | 'C' | 'D', OnboardingPalette> = {
  A: {
    accentStrong: '#E88A3D',
    accentSoft: '#F2B37A',
    accentMid: '#EFA065',
    accentTint: '#FCEFE3',
    borderIdle: 'rgba(0,0,0,0.10)',
    borderActive: 'rgba(232,138,61,0.92)',
    indicatorIdle: '#B8B1A8',
    title: '#1C1916',
    text: '#26221E',
    textSecondary: '#6B6258',
    progressTrack: '#F4EBE2',
  },
  B: {
    accentStrong: '#D97745',
    accentSoft: '#EAB08A',
    accentMid: '#E29367',
    accentTint: '#F9EEE7',
    borderIdle: 'rgba(0,0,0,0.10)',
    borderActive: 'rgba(217,119,69,0.92)',
    indicatorIdle: '#B8B1A8',
    title: '#1C1916',
    text: '#26221E',
    textSecondary: '#6B6258',
    progressTrack: '#F4EBE4',
  },
  C: {
    accentStrong: '#D9892B',
    accentSoft: '#F1BD7A',
    accentMid: '#E6A357',
    accentTint: '#FCF2E6',
    borderIdle: 'rgba(0,0,0,0.10)',
    borderActive: 'rgba(217,137,43,0.92)',
    indicatorIdle: '#B8B1A8',
    title: '#1C1916',
    text: '#26221E',
    textSecondary: '#6B6258',
    progressTrack: '#F5EDE1',
  },
  D: {
    accentStrong: '#2F80ED',
    accentSoft: '#9CC7FF',
    accentMid: '#5CA0F5',
    accentTint: '#ECF4FF',
    borderIdle: 'rgba(0,0,0,0.10)',
    borderActive: 'rgba(47,128,237,0.92)',
    indicatorIdle: '#B8B1A8',
    title: '#151A22',
    text: '#1C2430',
    textSecondary: '#5F6E84',
    progressTrack: '#E8EEF7',
  },
};

export const ONBOARDING_COLORS = ONBOARDING_PALETTES.D;
