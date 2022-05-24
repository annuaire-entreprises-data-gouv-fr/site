import React from 'react';

const Select: React.FC<{
  placeholder?: string;
  label?: string;
  name?: string;
  options: { value: string; label: string }[];
}> = ({
  label,
  options,
  placeholder = 'Selectionnez une option',
  name = '',
}) => (
  <div className="fr-select-group">
    {label && (
      <label className="fr-label" htmlFor="select">
        {label}
      </label>
    )}
    <select name={name} className="fr-select" id="select">
      <option value="" selected disabled hidden>
        {placeholder}
      </option>
      {options.map((option) => (
        <option value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

export default Select;
