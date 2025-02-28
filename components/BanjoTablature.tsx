"use client";

import { useEffect, useRef, useState } from "react";
import type { Roll } from "../app/banjo/components/RollSelector";

interface BanjoTablatureProps {
  roll: Roll;
  bpm: number;
  onNoteActive?: (isActive: boolean) => void;
  customRollPatterns?: Roll[];
}

export default function BanjoTablature({
  roll,
  bpm,
  onNoteActive,
  customRollPatterns = [],
}: BanjoTablatureProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showInitialSpace, setShowInitialSpace] = useState(true);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const rollNameRef = useRef(roll.name);
  const spacesPerNoteRef = useRef(3);
  const isPlayingRef = useRef(bpm > 0);

  // Get the current pattern
  const currentPattern = roll.pattern;

  // Constants for spacing and display
  const spacesPerNote = 3; // 3 dashes between notes
  const notesPerPattern = currentPattern.length; // 8 notes per pattern
  const totalColumns = 128; // Always use full width with 128 columns
  const activeColumnPosition = 2; // Position of the bold column (fixed)

  // Update ref value
  spacesPerNoteRef.current = spacesPerNote;

  // Reset position when roll changes
  useEffect(() => {
    if (rollNameRef.current !== roll.name) {
      setScrollPosition(0);
      lastTimeRef.current = 0;
      rollNameRef.current = roll.name;
      setShowInitialSpace(true); // Show initial space when pattern changes
    }
  }, [roll.name]);

  // Animation effect
  useEffect(() => {
    // Track playing state changes
    const wasPlaying = isPlayingRef.current;
    isPlayingRef.current = bpm > 0;

    if (bpm <= 0) {
      // Paused state
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    // If we're resuming from a paused state, reset the lastTimeRef
    // so we don't get a sudden jump in animation
    if (!wasPlaying && bpm > 0) {
      lastTimeRef.current = 0;
    }

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;

      const elapsed = timestamp - lastTimeRef.current;
      const msPerBeat = 60000 / bpm;

      if (elapsed > msPerBeat) {
        // Move forward by one beat (spacesPerNote + 1 positions)
        setScrollPosition(
          (prev) => (prev + spacesPerNoteRef.current + 1) % 1000
        );

        // After the first beat, we no longer need to show the initial space
        if (showInitialSpace) {
          setShowInitialSpace(false);
        }

        // Notify parent of active note when a note hits the active column
        if (onNoteActive) {
          onNoteActive(true);
          setTimeout(() => onNoteActive(false), 150);
        }

        lastTimeRef.current = timestamp;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [bpm, onNoteActive, showInitialSpace]);

  // Generate the tablature display
  const renderTablature = () => {
    const strings: React.ReactNode[] = [];

    // Create 5 strings (5 to 1, with 5 at the top)
    for (let stringNum = 5; stringNum >= 1; stringNum--) {
      const cells: React.ReactNode[] = [];

      // Generate the pattern display
      for (let col = 0; col < totalColumns; col++) {
        // Calculate the effective position in the pattern
        // This creates a scrolling effect by offsetting based on scrollPosition
        let effectivePosition =
          (col - activeColumnPosition + scrollPosition) %
          (notesPerPattern * (spacesPerNote + 1));

        // Add an extra beat of space at the beginning if needed
        if (showInitialSpace && col >= activeColumnPosition) {
          // Shift everything to the right by one beat
          effectivePosition -= spacesPerNote + 1;
        }

        // Determine if this is a note position (every spacesPerNote+1 positions)
        const isNotePosition = effectivePosition % (spacesPerNote + 1) === 0;

        // Calculate which note in the pattern we're displaying
        const patternIndex =
          Math.floor(effectivePosition / (spacesPerNote + 1)) % notesPerPattern;

        // Check if this string should have a note at this position
        const isActiveString =
          isNotePosition &&
          patternIndex >= 0 &&
          patternIndex < notesPerPattern &&
          currentPattern[patternIndex] === stringNum;

        // Determine what character to display
        let char = "-";
        if (isActiveString) {
          char = "0"; // Open string note
        }

        // Highlight the active column
        const isBoldColumn = col === activeColumnPosition;

        cells.push(
          <span
            key={`col-${col}`}
            className={isBoldColumn ? "font-bold text-lg" : ""}
          >
            {char}
          </span>
        );
      }

      strings.push(
        <div key={`string-${stringNum}`} className="flex">
          {/* Header part - string number */}
          <div className="w-6 pr-1 flex-shrink-0 font-mono">|{stringNum}|</div>

          {/* Live part - scrolling notes */}
          <div className="flex-grow overflow-hidden font-mono">{cells}</div>
        </div>
      );
    }

    return strings;
  };

  return (
    <div className="overflow-hidden w-full">
      <div className="font-mono whitespace-pre text-sm leading-tight w-full">
        <div className="relative w-full">{renderTablature()}</div>
      </div>
    </div>
  );
}
