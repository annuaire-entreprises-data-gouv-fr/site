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
      onClick={onClick}
      className={'fr-btn fr-btn--tertiary-no-outline ' + (className ?? '')}
      aria-label={ariaLabel}
      aria-controls={ariaControls}
    >
      × Fermer
    </button>
  );
}
