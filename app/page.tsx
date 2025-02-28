"use client";

import BanjoTablature from "@/components/BanjoTablature";
import HyperButton from "@/components/HyperButton";
import RollSelector, { rolls } from "@/components/RollSelector";
import SpeedControl from "@/components/SpeedControl";
import ASCIIMetronome from "@/components/ascii-metronome";
import { initAudio, playBanjoString } from "@/utils/audio";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentRoll, setCurrentRoll] = useState<string>("Forward");
  const [bpm, setBpm] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [metronomeOn, setMetronomeOn] = useState<boolean>(false);
  const [audioInitialized, setAudioInitialized] = useState<boolean>(false);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudio();
      setAudioInitialized(true);
      window.removeEventListener("click", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction);
    return () => window.removeEventListener("click", handleFirstInteraction);
  }, []);

  const handleNoteActive = (isActive: boolean, stringNumber?: number) => {
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
    <div className="flex flex-col items-center font-mono w-full max-w-full">
      <div className="p-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Pattern Section - Column 1 */}
          <div>
            <h2 className="font-bold mb-2">Pattern</h2>
            <div>
              <RollSelector
                currentRoll={currentRoll}
                setCurrentRoll={setCurrentRoll}
              />
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
            <div className="mb-1 flex flex-row items-center gap-2 flex-wrap">
              <HyperButton
                text={isPlaying ? "Pause" : "[Pause]"}
                disabled={!isPlaying}
                onClick={() => togglePlayback(false)}
              />
              <span>/</span>
              <HyperButton
                text={isPlaying ? "[Play]" : "Play"}
                disabled={isPlaying}
                onClick={() => togglePlayback(true)}
              />
            </div>

            <div className="mb-1 flex flex-row items-center gap-2 flex-wrap">
              <div>Sound: </div>
              <HyperButton
                text={isMuted ? "[Off]" : "Off"}
                disabled={isMuted}
                onClick={toggleMute}
              />
              <span>/</span>
              <HyperButton
                text={isMuted ? "On" : "[On]"}
                disabled={!isMuted}
                onClick={toggleMute}
              />
            </div>
            <div className="mb-4 flex flex-row items-center gap-2 flex-wrap">
              <div>Metronome: </div>
              <HyperButton
                text={metronomeOn ? "Off" : "[Off]"}
                disabled={!metronomeOn}
                onClick={() => setMetronomeOn(false)}
              />
              <span>/</span>
              <HyperButton
                text={metronomeOn ? "[On]" : "On"}
                disabled={metronomeOn}
                onClick={() => setMetronomeOn(true)}
              />
            </div>

            <div className="mb-1">
              <div>Pattern: {currentRoll}</div>
              <div>Tempo: {bpm} BPM</div>
              <div>Sound: {isMuted ? "Off" : "On"}</div>
            </div>
          </div>
        </div>

        {/* Tablature Section */}
        <div className="p-2 w-full">
          <BanjoTablature
            roll={selectedRoll}
            bpm={isPlaying ? bpm : 0}
            onNoteActive={handleNoteActive}
          />
        </div>

        {/* Metronome Section */}
        {metronomeOn && (
          <div className="mt-6 w-fit mx-auto">
            <ASCIIMetronome bpm={bpm} isPlaying={isPlaying} className="mt-2" />
          </div>
        )}
      </div>
    </div>
  );
}
