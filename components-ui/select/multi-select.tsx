import React from 'react';
import ReactSelect, { GroupBase, OptionsOrGroups, Props } from 'react-select';

type MultiSelectProps = {
  defaultValue?: string | string[];
  id: string;
  instanceId: Props['instanceId'];
  name?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
};

export const MultiSelect = ({
  defaultValue = undefined,
  instanceId,
  name,
  options,
  placeholder,
}: MultiSelectProps) => {
  const getDefaultValue = () => {
    if (!defaultValue) {
      return null;
    }
    if (typeof defaultValue === 'string') {
      return {
        value: defaultValue,
        label: options.find((option) => option.value === defaultValue)?.[
          'label'
        ],
      };
    }
    if (Array.isArray(defaultValue)) {
      return defaultValue.map((v) => ({
        value: v,
        label: options.find((option) => option.value === v)?.['label'],
      }));
    }
    return null;
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <ReactSelect
        defaultValue={getDefaultValue()}
        id="react-select-section-naf"
        instanceId={instanceId}
        isMulti
        menuPosition="fixed"
        name={name}
        options={options as OptionsOrGroups<{}, GroupBase<{}>>}
        placeholder={placeholder}
        styles={{
          clearIndicator: (base) => ({ ...base, color: '#000' }),
          placeholder: (base) => ({ ...base, color: '#161616' }),
          control: (baseStyles, state) => ({
            ...baseStyles,
            boxShadow: '0 !important',
            outline: state.isFocused ? '2px solid #0476f5' : '',
            outlineOffset: state.isFocused ? '2px' : '',
            backgroundColor: '#eeeeee',
            border: 'none',
            borderRadius: '0.25rem 0.25rem 0 0',
            borderBottom: '2px solid black',
            '&:hover': {
              borderBottom: '2px solid black',
            },
          }),
          dropdownIndicator: (base) => ({
            ...base,
            color: 'black',
            '&:hover': {
              color: 'black',
            },
          }),
          menuPortal: (base) => ({ ...base, zIndex: 2 }),
          multiValue: (base) => ({ ...base, backgroundColor: '#FFF' }),
        }}
      />
    </div>
  );
};
