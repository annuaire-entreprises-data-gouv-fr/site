import type { ChangeEventHandler } from "react";
import type { ISelectOptions } from "./type";

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
