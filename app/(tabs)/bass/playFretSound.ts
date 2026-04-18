import { Audio } from 'expo-av';

import { FRET_SOUND_MODULES } from './fretSoundModules';

let audioModeReady = false;
let currentSound: Audio.Sound | null = null;

async function ensureAudioMode() {
  if (audioModeReady) return;
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });
  audioModeReady = true;
}

/**
 * Joue l’échantillon MP3 pour une case (corde 1–4, frette 0–12), si le fichier existe.
 * Coupe la lecture précédente pour éviter l’empilement sur taps rapides.
 */
export async function playFretSound(stringNum: number, fret: number): Promise<void> {
  const key = `${stringNum}_${fret}`;
  const source = FRET_SOUND_MODULES[key];
  if (source === undefined) return;

  try {
    await ensureAudioMode();
  } catch {
    return;
  }

  try {
    if (currentSound) {
      try {
        await currentSound.stopAsync();
      } catch {
        /* ignore */
      }
      try {
        await currentSound.unloadAsync();
      } catch {
        /* ignore */
      }
      currentSound = null;
    }
  } catch {
    currentSound = null;
  }

  try {
    const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true, volume: 1 });
    currentSound = sound;
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded || !status.didJustFinish) return;
      void sound.unloadAsync().finally(() => {
        if (currentSound === sound) currentSound = null;
      });
    });
  } catch {
    currentSound = null;
  }
}
