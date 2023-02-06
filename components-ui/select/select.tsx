import React from 'react';

type SelectProps = {
  placeholder?: string;
  label?: string;
  name?: string;
  options: { value: string; label: string }[];
  defaultValue?: string | null;
  className?: string;
};

export const Select = ({
  label,
  options,
  placeholder = 'Selectionnez une option',
  name = '',
  defaultValue = null,
}: SelectProps) => (
  <div className="fr-select-group">
    {label && (
      <label className="fr-label" htmlFor="select">
        {label}
      </label>
    )}
    <select name={name} className="fr-select" defaultValue={defaultValue || ''}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
