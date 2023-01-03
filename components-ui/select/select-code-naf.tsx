import React from 'react';
import { codesNAFRev2 } from '#utils/labels/codes-NAF-rev-2';
import Select from '.';

const SelectCodeNaf: React.FC<{
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
    options={Object.keys(codesNAFRev2).map((k) => {
      //@ts-ignore
      return { value: k, label: `${k} - ${codesNAFRev2[k]}` };
    })}
  />
);

export default SelectCodeNaf;
