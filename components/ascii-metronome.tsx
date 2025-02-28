"use client";

import { useEffect, useState } from "react";

interface ASCIIMetronomeProps {
  activeNote?: number | null;
  isPlaying: boolean;
  className?: string;
}

export default function ASCIIMetronome({
  activeNote,
  isPlaying,
  className = "",
}: ASCIIMetronomeProps) {
  const [position, setPosition] = useState<"left" | "right">("left");

  // Arrays for the ASCII art
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
    }
  }, [isPlaying]);

  // Change position when activeNote changes
  useEffect(() => {
    if (isPlaying && activeNote !== undefined && activeNote !== null) {
      // Toggle the position whenever a new note becomes active
      setPosition((prev) => (prev === "left" ? "right" : "left"));
    }
  }, [activeNote, isPlaying]);

  return (
    <div className={`font-mono whitespace-pre text-center ${className}`}>
      <pre className="inline-block text-left text-sm">
        {position === "left" ? leftPosition : rightPosition}
      </pre>
    </div>
  );
}
