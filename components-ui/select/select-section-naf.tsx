import React from 'react';
import Select from '.';
import { codesSectionNAF } from '../../utils/labels/codes-section-NAF';

const SelectCodeSectionNaf: React.FC<{
  placeholder?: string;
  label?: string;
  name?: string;
  maxWidth?: number;
  defaultValue?: string;
}> = ({ label, placeholder, name, defaultValue = undefined }) => (
  <Select
    label={label}
    name={name}
    defaultValue={defaultValue}
    placeholder={placeholder}
    options={Object.keys(codesSectionNAF).map((k) => {
      //@ts-ignore
      return { value: k, label: codesSectionNAF[k] };
    })}
  />
);

export default SelectCodeSectionNaf;
