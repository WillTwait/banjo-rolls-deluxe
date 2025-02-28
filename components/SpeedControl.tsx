import type { Dispatch, SetStateAction } from "react";
import HyperButton from "./HyperButton";

interface SpeedButtonProps {
  amount: number;
  adjustSpeed: (amount: number) => void;
}

function SpeedButton({ amount, adjustSpeed }: SpeedButtonProps) {
  const label = amount > 0 ? `+${amount}` : `${amount}`;

  return (
    <HyperButton
      text={label}
      disabled={false}
      onClick={() => adjustSpeed(amount)}
    />
  );
}

interface SpeedControlProps {
  bpm: number;
  setBpm: Dispatch<SetStateAction<number>>;
}

export default function SpeedControl({ bpm, setBpm }: SpeedControlProps) {
  const adjustSpeed = (amount: number) => {
    setBpm((prevBpm) => {
      const newBpm = prevBpm + amount;
      return Math.min(Math.max(newBpm, 1), 600); // Clamp between 1-600 BPM
    });
  };

  function SpeedButtonGroup({ amount }: { amount: number }) {
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

  return (
    <div className="font-mono">
      <div className="space-y-2">
        <SpeedButtonGroup amount={1} />
        <SpeedButtonGroup amount={5} />
        <SpeedButtonGroup amount={10} />
      </div>
    </div>
  );
}
