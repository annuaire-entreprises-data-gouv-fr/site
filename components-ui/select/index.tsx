import React from 'react';

const Select: React.FC<{
  placeholder?: string;
  label?: string;
  name?: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  size: 'S' | 'M';
}> = ({
  label,
  options,
  placeholder = 'Selectionnez une option',
  name = '',
  defaultValue = null,
  size = 'M',
}) => (
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
    <style jsx>{`
      select {
        font-size: ${size === 'S' ? '0.9rem' : '1rem'};
      }
    `}</style>
  </div>
);

export default Select;
