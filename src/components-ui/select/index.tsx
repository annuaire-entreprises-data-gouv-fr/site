import type { ChangeEventHandler } from "react";
import type { ISelectOptions } from "./type";

interface SelectProps {
  className?: string;
  defaultValue?: string | null;
  label?: string;
  name?: string;
  onChange?: ChangeEventHandler | undefined;
  options: ISelectOptions[];
  placeholder?: string | null;
}

export const Select = ({
  label,
  options,
  placeholder = null,
  name = "",
  defaultValue = null,
  onChange,
}: SelectProps) => (
  <div className="fr-select-group">
    {label && (
      <label className="fr-label" htmlFor={name}>
        {label}
      </label>
    )}
    <select
      className="fr-select"
      defaultValue={defaultValue || ""}
      id={name}
      name={name}
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
