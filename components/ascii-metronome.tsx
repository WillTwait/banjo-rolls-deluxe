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

  const leftPosition = leftPositionLines.join("\n");
  const rightPosition = rightPositionLines.join("\n");

  useEffect(() => {
    if (isPlaying && activeNote !== undefined && activeNote !== null) {
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
