import { MultiSelect } from '#components-ui/select/multi-select';

type IProps = {
  onChange: (selectedValues: string[]) => void;
  dataSelect: { value: string; label: string }[];
  placeholder?: string;
  fallback?: JSX.Element | null;
};

export default function TableFilter({
  dataSelect,
  onChange,
  placeholder,
  fallback = null,
}: IProps) {
  if (!dataSelect || dataSelect.length <= 1) {
    return fallback;
  }

  return (
    <div className="layout-right" style={{ marginBottom: '15px' }}>
      <MultiSelect
        placeholder={placeholder}
        instanceId="table-filter"
        id="table-filter"
        onChange={onChange}
        options={dataSelect.map(({ value, label }) => ({
          value,
          label,
        }))}
        menuPosition="absolute"
      />
    </div>
  );
}
