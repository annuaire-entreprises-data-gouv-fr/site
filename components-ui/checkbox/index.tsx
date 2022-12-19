import { randomId } from '#utils/helpers';

export const Checkbox: React.FC<{ label: string; value: boolean }> = ({
  label,
  value,
}) => {
  const id = `chckbx-${randomId()}`;

  return (
    <div className="fr-checkbox-group">
      <input type="checkbox" id={id} name="checkbox" checked={value} />
      <label className="fr-label" htmlFor={id}>
        {label}
      </label>
      <style jsx>{`
        .fr-checkbox-group > label {
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};
