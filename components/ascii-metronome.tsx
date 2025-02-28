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
    } else {
      // Reset timing when starting to play
      lastTickTimeRef.current = 0;
    }
  }, [isPlaying]);

  // Use requestAnimationFrame for more precise timing
  useEffect(() => {
    if (!isPlaying || bpm <= 0) return;

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
