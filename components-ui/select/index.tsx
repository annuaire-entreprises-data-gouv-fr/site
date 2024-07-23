import { ChangeEventHandler } from 'react';
import { ISelectOptions } from './type';

type SelectProps = {
  placeholder?: string | null;
  label?: string;
  name?: string;
  options: ISelectOptions[];
  defaultValue?: string | null;
  className?: string;
  onChange?: ChangeEventHandler | undefined;
};

export const Select = ({
  label,
  options,
  placeholder = null,
  name = '',
  defaultValue = null,
  onChange = undefined,
}: SelectProps) => (
  <div className="fr-select-group">
    {label && (
      <label className="fr-label" htmlFor="select">
        {label}
      </label>
    )}
    <select
      name={name}
      className="fr-select"
      defaultValue={defaultValue || ''}
      onChange={onChange}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
