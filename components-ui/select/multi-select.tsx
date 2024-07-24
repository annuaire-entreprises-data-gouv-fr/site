import ReactSelect, { GroupBase, OptionsOrGroups, Props } from 'react-select';
import { ISelectOptions } from './type';

type MultiSelectProps = {
  defaultValue?: string | string[];
  id: string;
  instanceId: Props['instanceId'];
  name?: string;
  options: ISelectOptions[];
  placeholder?: string;
  onChange?: (values: string[]) => void;
  maxWidth?: string;
  menuPosition: 'absolute' | 'fixed';
};

export const MultiSelect = ({
  defaultValue = undefined,
  instanceId,
  name,
  options,
  placeholder,
  onChange,
  maxWidth = 'none',
  menuPosition,
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

  const onUpdate = (options: ISelectOptions[]) => {
    if (onChange) {
      onChange(options.map((o) => o.value));
    }
  };

  return (
    <div style={{ marginBottom: 16, width: '100%', maxWidth }}>
      <ReactSelect
        defaultValue={getDefaultValue()}
        id="react-select-section-naf"
        instanceId={instanceId}
        isMulti
        menuPosition={menuPosition}
        menuPlacement="auto"
        name={name}
        options={options as OptionsOrGroups<{}, GroupBase<{}>>}
        noOptionsMessage={() => 'Liste vide'}
        placeholder={placeholder}
        //@ts-ignore
        onChange={onUpdate}
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
          menuPortal: (base) => ({
            ...base,
            zIndex: 2,
          }),
          multiValue: (base) => ({ ...base, backgroundColor: '#FFF' }),
        }}
      />
    </div>
  );
};
