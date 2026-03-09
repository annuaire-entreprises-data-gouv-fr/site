import { MultiSelect } from "#components-ui/select/multi-select";

interface IProps {
  dataSelect: { value: string; label: string }[];
  fallback?: React.JSX.Element | null;
  onChange: (selectedValues: string[]) => void;
  placeholder?: string;
}

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
    <div className="layout-right" style={{ marginBottom: "15px" }}>
      <MultiSelect
        id="table-filter"
        instanceId="table-filter"
        maxWidth="375px"
        menuPosition="absolute"
        onChange={onChange}
        options={dataSelect.map(({ value, label }) => ({
          value,
          label,
        }))}
        placeholder={placeholder}
      />
    </div>
  );
}
