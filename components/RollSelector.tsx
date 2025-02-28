import type { Dispatch, SetStateAction } from "react";
import HyperButton from "./HyperButton";

interface RollSelectorProps {
  currentRoll: string;
  setCurrentRoll: Dispatch<SetStateAction<string>>;
}

export interface Roll {
  name: string;
  pattern: number[];
}

export const rolls: Roll[] = [
  {
    name: "Forward",
    pattern: [4, 5, 1, 4, 5, 1, 4, 5], // Thumb, index, middle pattern
  },
  {
    name: "Backward",
    pattern: [5, 4, 1, 5, 4, 1, 5, 4], // Middle, index, thumb pattern
  },
  {
    name: "Reverse",
    pattern: [3, 4, 5, 1, 5, 4, 3, 5], // Classic bluegrass pattern
  },
  {
    name: "Foggy Mountain",
    pattern: [3, 4, 1, 5, 2, 4, 1, 5], // Classic bluegrass pattern
  },
];

export default function RollSelector({
  currentRoll,
  setCurrentRoll,
}: RollSelectorProps) {
  return (
    <div className="space-y-2">
      {rolls.map((roll, index) => (
        <div key={index.toString()}>
          <HyperButton
            text={currentRoll === roll.name ? `[${roll.name}]` : roll.name}
            disabled={currentRoll === roll.name}
            onClick={() => setCurrentRoll(roll.name)}
          />
        </div>
      ))}
    </div>
  );
}
