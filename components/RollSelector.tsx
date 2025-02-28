import type { Dispatch, SetStateAction } from 'react';
import HyperButton from './HyperButton';

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
    name: 'Strum',
    pattern: [5, 4, 3, 2, 1, 5, 4, 3], // Thumb, index, middle pattern
  },
  {
    name: 'Forward',
    pattern: [2, 1, 5, 2, 1, 5, 2, 1], // Thumb, index, middle pattern
  },
  {
    name: 'Backward',
    pattern: [1, 2, 5, 1, 2, 5, 1, 2], // Middle, index, thumb pattern
  },
  {
    name: 'Forward-Reverse',
    pattern: [3, 2, 1, 5, 1, 2, 3, 1], // Classic bluegrass pattern
  },
  {
    name: 'Alternating',
    pattern: [3, 2, 5, 1, 4, 2, 5, 1], // Classic bluegrass pattern
  },
];

export default function RollSelector({ currentRoll, setCurrentRoll }: RollSelectorProps) {
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
