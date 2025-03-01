import { memo, useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import HyperButton from "./HyperButton";

interface SpeedButtonProps {
  amount: number;
  adjustSpeed: (amount: number) => void;
}

// memoizing prevents unnecessary re-renders
const SpeedButton = memo(({ amount, adjustSpeed }: SpeedButtonProps) => {
  const label = amount > 0 ? `+${amount}` : `${amount}`;

  const handleClick = useCallback(() => {
    adjustSpeed(amount);
  }, [adjustSpeed, amount]);

  return <HyperButton text={label} disabled={false} onClick={handleClick} />;
});

SpeedButton.displayName = "SpeedButton";

interface SpeedControlProps {
  bpm: number;
  setBpm: Dispatch<SetStateAction<number>>;
}

const SpeedButtonGroup = memo(
  ({
    amount,
    adjustSpeed,
  }: { amount: number; adjustSpeed: (amount: number) => void }) => {
    return (
      <div className="flex flex-row">
        {"["}
        <div className="flex flex-row gap-4">
          <SpeedButton amount={-amount} adjustSpeed={adjustSpeed} />
          <SpeedButton amount={amount} adjustSpeed={adjustSpeed} />
        </div>
        {"]"}
      </div>
    );
  }
);

SpeedButtonGroup.displayName = "SpeedButtonGroup";

export default function SpeedControl({ setBpm }: SpeedControlProps) {
  const adjustSpeed = useCallback(
    (amount: number) => {
      setBpm((prevBpm) => {
        const newBpm = prevBpm + amount;
        return Math.min(Math.max(newBpm, 1), 600); // Clamp between 1-600 BPM
      });
    },
    [setBpm]
  );

  return (
    <div className="font-mono">
      <div className="space-y-1">
        <SpeedButtonGroup amount={1} adjustSpeed={adjustSpeed} />
        <SpeedButtonGroup amount={5} adjustSpeed={adjustSpeed} />
        <SpeedButtonGroup amount={10} adjustSpeed={adjustSpeed} />
        <SpeedButtonGroup amount={50} adjustSpeed={adjustSpeed} />
      </div>
    </div>
  );
}
