'use client';

import BanjoTablature from '@/components/BanjoTablature';
import HyperButton from '@/components/HyperButton';
import RollSelector, { rolls } from '@/components/RollSelector';
import SpeedControl from '@/components/SpeedControl';
import Frame from '@/components/frame';
import { initAudio, playBanjoString } from '@/utils/audio';
import { useEffect, useState } from 'react';

export default function Home() {
  const [currentRoll, setCurrentRoll] = useState<string>('Forward');
  const [bpm, setBpm] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeNote, setActiveNote] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [audioInitialized, setAudioInitialized] = useState<boolean>(false);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudio();
      setAudioInitialized(true);
      window.removeEventListener('click', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, []);

  const handleNoteActive = (isActive: boolean, stringNumber?: number) => {
    setActiveNote(isActive);

    // Play sound when a note becomes active and audio is not muted
    if (isActive && stringNumber && !isMuted && audioInitialized) {
      playBanjoString(stringNumber);
    }
  };

  // Toggle play/pause state
  const togglePlayback = (playing: boolean) => {
    setIsPlaying(playing);
  };

  // Toggle mute state
  const toggleMute = () => {
    // If we're unmuting for the first time, make sure audio is initialized
    if (isMuted && !audioInitialized) {
      initAudio();
      setAudioInitialized(true);
    }
    setIsMuted(!isMuted);
  };

  // Find the current roll object
  const selectedRoll = rolls.find((r) => r.name === currentRoll) || rolls[0];

  return (
    <div className="pt-6 flex flex-col items-center font-mono w-full max-w-full">
      <div className="p-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Pattern Section - Column 1 */}
          <div>
            <h2 className="font-bold mb-2">Pattern</h2>
            <div>
              <RollSelector currentRoll={currentRoll} setCurrentRoll={setCurrentRoll} />
            </div>
          </div>

          {/* Tempo Section - Column 2 */}
          <div>
            <h2 className="font-bold mb-2">Tempo</h2>
            <div>
              <SpeedControl bpm={bpm} setBpm={setBpm} />
            </div>
          </div>

          {/* Controls Section - Column 3 */}
          <div>
            <h2 className="font-bold mb-2">Controls</h2>
            <div className="mb-2 flex flex-row items-center gap-2 flex-wrap">
              <HyperButton
                text={isPlaying ? 'Pause' : '[Pause]'}
                disabled={!isPlaying}
                onClick={() => togglePlayback(false)}
              />
              <span>/</span>
              <HyperButton
                text={isPlaying ? '[Play]' : 'Play'}
                disabled={isPlaying}
                onClick={() => togglePlayback(true)}
              />
            </div>

            <div className="mb-4">
              <HyperButton
                text={isMuted ? '[Muted]' : 'Muted'}
                disabled={isMuted}
                onClick={toggleMute}
              />
              <span>/</span>
              <HyperButton
                text={isMuted ? 'Sound' : '[Sound]'}
                disabled={!isMuted}
                onClick={toggleMute}
              />
            </div>

            <div className="mb-1">
              <div>Pattern: {currentRoll}</div>
              <div>Tempo: {bpm} BPM</div>
              <div>Sound: {isMuted ? 'Off' : 'On'}</div>
            </div>
          </div>
        </div>

        {/* Tablature Section - Full Width */}
        <div className="p-2 w-full">
          <BanjoTablature
            roll={selectedRoll}
            bpm={isPlaying ? bpm : 0}
            onNoteActive={handleNoteActive}
          />
        </div>
      </div>
    </div>
  );
}
