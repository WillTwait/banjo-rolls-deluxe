"use client";

import BanjoTablature from "@/components/BanjoTablature";
import HyperButton from "@/components/HyperButton";
import RollSelector, { rolls } from "@/components/RollSelector";
import SpeedControl from "@/components/SpeedControl";
import Frame from "@/components/frame";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentRoll, setCurrentRoll] = useState<string>("Forward");
  const [bpm, setBpm] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeNote, setActiveNote] = useState<boolean>(false);

  const handleNoteActive = (isActive: boolean) => {
    setActiveNote(isActive);
  };

  // Toggle play/pause state
  const togglePlayback = (playing: boolean) => {
    console.log("Toggling playback to:", playing);
    setIsPlaying(playing);
  };

  // Debug effect to monitor state changes
  useEffect(() => {
    console.log("Current state - isPlaying:", isPlaying, "bpm:", bpm);
  }, [isPlaying, bpm]);

  // Find the current roll object
  const selectedRoll = rolls.find((r) => r.name === currentRoll) || rolls[0];

  return (
    <div className="pt-6 flex flex-col items-center font-mono w-full max-w-full">
      <div className="p-4 w-full">
        <div className="grid grid-cols-3 gap-6 mb-6">
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
            <div className="mb-4 flex flex-row items-center gap-2">
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

            <div className="mb-4">
              <span>Pattern: {currentRoll}</span>
            </div>

            <div className="mb-2">
              <div className="mb-2">
                <span>Tempo: {bpm} BPM</span>
              </div>
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
