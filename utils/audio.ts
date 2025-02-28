// Map of string numbers to frequencies (in Hz)
// These are approximate frequencies for a standard G tuning banjo (gDGBD)
// In standard tablature notation:
// String 1 (top line): D4 (high D)
// String 2: B3
// String 3: G3
// String 4: D3 (lowest pitch)
// String 5 (bottom line): G4 (high G drone)
const STRING_FREQUENCIES: Record<number, number> = {
  1: 293.66, // D4 (first string - high D)
  2: 246.94, // B3 (second string)
  3: 196.0, // G3 (third string)
  4: 146.83, // D3 (fourth string - lowest pitch)
  5: 392.0, // G4 (fifth string - high G drone)
};

// AudioContext singleton
let audioContext: AudioContext | null = null;
let audioInitialized = false;

/**
 * Initialize the audio context (must be called after a user interaction)
 */
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

/**
 * Check if audio is initialized
 */
export function isAudioInitialized(): boolean {
  return audioInitialized && audioContext !== null;
}

/**
 * Play a banjo note for a specific string
 * @param stringNumber - The string number (1-5)
 * @param duration - Duration in milliseconds
 */
export function playBanjoString(stringNumber: number, duration = 300): void {
  // Try to initialize audio if not already initialized
  if (!audioContext) {
    try {
      initAudio();
    } catch (error) {
      console.error("Failed to initialize audio context:", error);
      return;
    }
  }

  // Make sure the audio context is running
  if (audioContext?.state === "suspended") {
    audioContext.resume().catch((error) => {
      console.error("Failed to resume audio context:", error);
      return;
    });
  }

  if (!audioContext) return;

  // Get the frequency for the string
  const frequency = STRING_FREQUENCIES[stringNumber];
  if (!frequency) {
    console.warn(`No frequency defined for string ${stringNumber}`);
    return;
  }

  try {
    // Create an oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Configure the oscillator
    oscillator.type = "triangle"; // Triangle wave sounds a bit like a plucked string
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    // Configure the gain (volume envelope)
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + duration / 1000
    );

    // Connect the nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Play the note
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration / 1000);

    // Clean up
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  } catch (error) {
    console.error("Error playing banjo string:", error);
  }
}

/**
 * Stop all audio
 */
export function stopAudio(): void {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
    audioInitialized = false;
  }
}
