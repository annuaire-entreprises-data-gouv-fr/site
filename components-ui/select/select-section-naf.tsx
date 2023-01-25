import React from 'react';
import ReactSelect from 'react-select';
import { codesSectionNAF } from '#utils/labels/codes-section-NAF';

const SelectCodeSectionNaf: React.FC<{
  placeholder?: string;
  name?: string;
  maxWidth?: number;
  defaultValue?: string | string[];
}> = ({ placeholder, name, defaultValue = undefined }) => {
  const getDefaultValue = () => {
    if (defaultValue && typeof defaultValue === 'string') {
      return {
        value: defaultValue,
        label: codesSectionNAF[defaultValue as keyof typeof codesSectionNAF],
      };
    }
    if (Array.isArray(defaultValue)) {
      return defaultValue.map((v) => ({
        value: v,
        label: codesSectionNAF[v as keyof typeof codesSectionNAF],
      }));
    }
    return null;
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <ReactSelect
        id="react-select-section-naf"
        instanceId="react-select-section-naf"
        isMulti
        menuPosition="fixed"
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 2 }),
          multiValue: (base) => ({ ...base, backgroundColor: '#FFF' }),
          clearIndicator: (base) => ({ ...base, color: '#000' }),
          dropdownIndicator: (base) => ({
            ...base,
            color: 'black',
            '&:hover': {
              color: 'black',
            },
          }),
          control: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: '#eeeeee',
            border: 'none',
            borderRadius: '0.25rem 0.25rem 0 0',
            borderBottom: '2px solid black',
            '&:hover': {
              borderBottom: '2px solid black',
            },
          }),
        }}
        name={name}
        placeholder={placeholder}
        defaultValue={getDefaultValue()}
        options={Object.keys(codesSectionNAF).map((k) => ({
          value: k,
          label: codesSectionNAF[k as keyof typeof codesSectionNAF],
        }))}
      />
    </div>
  );
};

export default SelectCodeSectionNaf;
