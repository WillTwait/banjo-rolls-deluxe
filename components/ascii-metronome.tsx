"use client";

import { useEffect, useState } from "react";

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

  // Toggle the position based on BPM
  useEffect(() => {
    if (!isPlaying || bpm <= 0) return;

    // Calculate interval in milliseconds from BPM
    const interval = (60 / bpm) * 1000;

    const timer = setInterval(() => {
      setPosition((prev) => (prev === "left" ? "right" : "left"));
    }, interval);

    return () => clearInterval(timer);
  }, [bpm, isPlaying]);

  return (
    <div className={`font-mono whitespace-pre text-center ${className}`}>
      <pre className="inline-block text-left text-sm">
        {position === "left" ? leftPosition : rightPosition}
      </pre>
    </div>
  );
}
