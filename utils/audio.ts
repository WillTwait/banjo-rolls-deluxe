// Map of string numbers to frequencies (in Hz)
// TODO: eventually add more instruments
const STRING_FREQUENCIES: Record<number, number> = {
  1: 293.66, // D4
  2: 246.94, // B3
  3: 196.0, // G3
  4: 146.83, // D3
  5: 392.0, // G4
};

let audioContext: AudioContext | null = null;
let audioInitialized = false;

export function initAudio(): AudioContext {
  try {
    if (!audioContext) {
      audioContext = new AudioContext();
      audioInitialized = true;
    } else if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    return audioContext;
  } catch (error) {
    console.error("Failed to initialize audio context:", error);
    throw error;
  }
}

export function isAudioInitialized(): boolean {
  return audioInitialized && audioContext !== null;
}

/**
 * Play a banjo note for a specific string
 * @param stringNumber - The string number (1-5)
 * @param duration - Duration in milliseconds
 */
export function playBanjoString(stringNumber: number, duration = 300): void {
  if (!audioContext) {
    try {
      initAudio();
    } catch (error) {
      console.error("Failed to initialize audio context:", error);
      return;
    }
  }

  if (audioContext?.state === "suspended") {
    audioContext.resume().catch((error) => {
      console.error("Failed to resume audio context:", error);
      return;
    });
  }

  if (!audioContext) return;

  const frequency = STRING_FREQUENCIES[stringNumber];
  if (!frequency) {
    console.warn(`No frequency defined for string ${stringNumber}`);
    return;
  }

  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "triangle"; // Triangle wave sounds a bit like a plucked string
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + duration / 1000
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration / 1000);

    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  } catch (error) {
    console.error("Error playing banjo string:", error);
  }
}

export function stopAudio(): void {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
    audioInitialized = false;
  }
}
