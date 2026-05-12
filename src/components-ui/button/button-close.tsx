import { clsx } from "clsx";

interface IProps {
  ariaControls: string;
  ariaLabel: string;
  className?: string;
  onClick: () => void;
}

export default function ButtonClose({
  onClick,
  ariaControls,
  ariaLabel,
  className,
}: IProps) {
  return (
    <button
      aria-controls={ariaControls}
      aria-label={ariaLabel}
      className={clsx("fr-btn", "fr-btn--tertiary-no-outline", className)}
      onClick={onClick}
      type="button"
    >
      × Fermer
    </button>
  );
}
