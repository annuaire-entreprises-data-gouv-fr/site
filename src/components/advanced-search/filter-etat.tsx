import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import styles from "./style.module.css";

interface IProps {
  etat?: string;
}

export function FilterEtat(props: IProps) {
  const { etat = "" } = props;

  const [value, setValue] = useState(etat);

  useEffect(() => {
    setValue(etat);
  }, [etat]);

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setValue(event.currentTarget.value);
      event.currentTarget.form?.requestSubmit();
    },
    []
  );

  return (
    <select
      className={clsx(styles.etatSelect, value && styles.etatSelectWithValue)}
      data-etat={value}
      id="etat-select"
      name="etat"
      onChange={onChange}
      value={value}
    >
      <option value="">tout état</option>
      <option value="A">en activité</option>
      <option value="C">cessée</option>
    </select>
  );
}
