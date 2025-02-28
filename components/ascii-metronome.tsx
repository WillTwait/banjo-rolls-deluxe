"use client";

import { useEffect, useRef, useState } from "react";

interface ASCIIMetronomeProps {
  bpm: number;
  isPlaying: boolean;
  className?: string;
}

export default function ASCIIMetronome({
  bpm,
  isPlaying,
  className = "",
}: ASCIIMetronomeProps) {
  const [position, setPosition] = useState<"left" | "right">("left");
  const lastTickTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const initializedRef = useRef<boolean>(false);

  // Small timing offset to ensure synchronization with tablature (in milliseconds)
  // This can be adjusted if needed to perfectly match the tablature
  const SYNC_OFFSET = -20;

  const leftPositionLines = [
    "  \\   --  ",
    "   \\ /  \\  ",
    "    \\ || \\  ",
    "   / \\ |  \\  ",
    "  |   \\|   |  ",
    "  |___||___|  ",
    "    |____|    ",
  ];

  const rightPositionLines = [
    "      --   /",
    "     /  \\ / ",
    "    / || /  ",
    "   /  | / \\  ",
    "  |   |/   |  ",
    "  |___||___|  ",
    "    |____|   ",
  ];

  // Join the arrays into strings
  const leftPosition = leftPositionLines.join("\n");
  const rightPosition = rightPositionLines.join("\n");

  // Reset the metronome when play state changes
  useEffect(() => {
    if (!isPlaying) {
      setPosition("left");
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      initializedRef.current = false;
    } else {
      // Reset timing when starting to play
      lastTickTimeRef.current = 0;
    }
  }, [isPlaying]);

  // Use requestAnimationFrame for more precise timing
  useEffect(() => {
    if (!isPlaying || bpm <= 0) return;

    // Calculate the current beat phase based on the current time
    // This helps synchronize when the metronome is turned on mid-beat
    const synchronizeWithCurrentBeat = () => {
      if (!initializedRef.current) {
        const msPerBeat = 60000 / bpm;
        const now = performance.now();

        // Calculate how far we are into the current beat cycle
        const currentPhase = now % msPerBeat;

        // If we're more than halfway through a beat, start with the opposite position
        // This makes the metronome more likely to sync correctly with the tablature
        if (currentPhase > msPerBeat / 2) {
          setPosition("right");
          // Set the lastTickTime to account for the current phase
          lastTickTimeRef.current = now - currentPhase + SYNC_OFFSET;
        } else {
          setPosition("left");
          // Set the lastTickTime to account for the current phase
          lastTickTimeRef.current =
            now - currentPhase - msPerBeat + SYNC_OFFSET;
        }

        initializedRef.current = true;
      }
    };

    synchronizeWithCurrentBeat();

    const animate = (timestamp: number) => {
      if (!lastTickTimeRef.current) {
        lastTickTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastTickTimeRef.current;
      const msPerBeat = 60000 / bpm;

      // Apply the sync offset to ensure the metronome ticks exactly when notes hit the bold column
      if (elapsed >= msPerBeat + SYNC_OFFSET) {
        setPosition((prev) => (prev === "left" ? "right" : "left"));
        lastTickTimeRef.current = timestamp;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [bpm, isPlaying]);

  return (
    <div className={`font-mono whitespace-pre text-center ${className}`}>
      <pre className="inline-block text-left text-sm">
        {position === "left" ? leftPosition : rightPosition}
      </pre>
    </div>
  );
}
