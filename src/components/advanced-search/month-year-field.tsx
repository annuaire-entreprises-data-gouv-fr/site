import { useState } from "react";
import styles from "./month-year-field.module.css";

const FIRST_BIRTH_YEAR = 1900;

const MONTHS = [
  { value: "01", label: "Janvier" },
  { value: "02", label: "Février" },
  { value: "03", label: "Mars" },
  { value: "04", label: "Avril" },
  { value: "05", label: "Mai" },
  { value: "06", label: "Juin" },
  { value: "07", label: "Juillet" },
  { value: "08", label: "Août" },
  { value: "09", label: "Septembre" },
  { value: "10", label: "Octobre" },
  { value: "11", label: "Novembre" },
  { value: "12", label: "Décembre" },
] as const;

const birthYears = (() => {
  const years: string[] = [];
  const currentYear = new Date().getFullYear();

  for (let year = currentYear; year >= FIRST_BIRTH_YEAR; year--) {
    years.push(String(year));
  }

  return years;
})();

const parseYearMonth = (value?: string) => {
  const [year = "", month = ""] = (value ?? "").slice(0, 7).split("-");
  const knownMonth = MONTHS.some((item) => item.value === month);
  const knownYear = birthYears.includes(year);

  if (!(knownMonth && knownYear)) {
    return { month: "", year: "" };
  }

  return { month, year };
};

interface MonthYearFieldProps {
  defaultValue?: string;
  id: string;
  label: string;
  name: string;
}

export const MonthYearField = (props: MonthYearFieldProps) => {
  const { defaultValue, id, label, name } = props;
  const initial = parseYearMonth(defaultValue);
  const [month, setMonth] = useState(initial.month);
  const [year, setYear] = useState(initial.year);
  const value = month && year ? `${year}-${month}` : "";

  return (
    <div className={styles.fields}>
      <div className={`fr-select-group ${styles.field} ${styles.month}`}>
        <label className="fr-label fr-sr-only" htmlFor={`${id}-month`}>
          Mois {label}
        </label>
        <select
          className="fr-select"
          id={`${id}-month`}
          onChange={(event) => {
            setMonth(event.currentTarget.value);
          }}
          value={month}
        >
          <option value="">Mois</option>
          {MONTHS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className={`fr-select-group ${styles.field}`}>
        <label className="fr-label fr-sr-only" htmlFor={`${id}-year`}>
          Année {label}
        </label>
        <select
          className="fr-select"
          id={`${id}-year`}
          onChange={(event) => {
            setYear(event.currentTarget.value);
          }}
          value={year}
        >
          <option value="">Année</option>
          {birthYears.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <input name={name} type="hidden" value={value} />
    </div>
  );
};
