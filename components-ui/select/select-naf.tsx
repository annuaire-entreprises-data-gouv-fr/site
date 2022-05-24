import React from 'react';
import Select from '.';
import { codesNaf } from '../../utils/labels/codes-NAF';

const SelectCodeNaf: React.FC<{
  placeholder?: string;
  label?: string;
  name?: string;
}> = ({ label, placeholder, name }) => (
  <>
    <Select
      label={label}
      name={name}
      placeholder={placeholder}
      options={Object.keys(codesNaf).map((k) => {
        //@ts-ignore
        return { value: k, label: `${k} : ${codesNaf[k]}` };
      })}
    />
  </>
);

export default SelectCodeNaf;
