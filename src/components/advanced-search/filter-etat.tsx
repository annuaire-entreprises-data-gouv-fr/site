import clsx from "clsx";
import { Link } from "../link";
import styles from "./style.module.css";

interface IProps {
  etat?: string;
}

export function FilterEtat(props: IProps) {
  const { etat = "" } = props;

  return (
    <>
      <Link
        className={clsx(
          styles.etatSelect,
          etat === "A" && styles.etatSelectWithValue
        )}
        search={(prev) => ({ ...prev, etat: etat === "A" ? undefined : "A" })}
        to="/rechercher"
      >
        en activité
      </Link>
      <input name="etat" type="hidden" value={etat} />
    </>
  );
}
