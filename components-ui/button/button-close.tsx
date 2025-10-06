type IProps = {
  onClick: () => void;
  ariaControls: string;
  ariaLabel: string;
  className?: string;
};

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
      className={"fr-btn fr-btn--tertiary-no-outline " + (className ?? "")}
      onClick={onClick}
    >
      × Fermer
    </button>
  );
}
