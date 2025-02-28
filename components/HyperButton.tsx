interface HyperButtonProps {
  text: string;
  disabled: boolean;
  onClick: () => void;
}

export default function HyperButton({
  text,
  disabled = false,
  onClick,
}: HyperButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-transparent border-0 font-mono text-left ${
        disabled ? "" : "cursor-pointer"
      }`}
      type="button"
    >
      <span
        className={disabled ? "" : "border-b border-black hover:border-b-2"}
      >
        {text}
      </span>
    </button>
  );
}
