import { ChangeEvent } from 'react';
import { Select } from '#components-ui/select';

type IProps = {
  onChange: (e: string) => void;
  dataSelect: { value: string; label: string }[];
  placeholder?: string;
};

export default function TableFilter({
  dataSelect,
  onChange,
  placeholder,
}: IProps) {
  if (!dataSelect || dataSelect.length === 0) {
    return null;
  }

  const onFilter = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value as string);
  };

  return (
    <div className="layout-right" style={{ marginBottom: '15px' }}>
      <Select
        placeholder={placeholder}
        onChange={onFilter}
        options={dataSelect.map(({ value, label }) => ({
          value,
          label,
        }))}
      />
    </div>
  );
}
