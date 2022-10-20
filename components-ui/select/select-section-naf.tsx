import React from 'react';
import Select from '.';
import { codesSectionNAF } from '../../utils/labels/codes-section-NAF';

const SelectCodeSectionNaf: React.FC<{
  placeholder?: string;
  label?: string;
  name?: string;
  maxWidth?: number;
  defaultValue?: string;
  className: string;
}> = ({ label, placeholder, name, defaultValue = undefined, className }) => (
  <Select
    label={label}
    name={name}
    defaultValue={defaultValue}
    placeholder={placeholder}
    options={Object.keys(codesSectionNAF).map((k) => {
      //@ts-ignore
      return { value: k, label: codesSectionNAF[k] };
    })}
    className={className}
  />
);

export default SelectCodeSectionNaf;
