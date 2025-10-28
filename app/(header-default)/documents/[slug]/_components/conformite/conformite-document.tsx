import { clsx } from "clsx";
import { Icon } from "#components-ui/icon/wrapper";
import { formatDate } from "#utils/helpers";
import styles from "./styles.module.css";

export const ConformiteDocument: React.FC<{
  url: string;
  label: string | null;
  dateDelivrance: string | null;
}> = ({ url, label, dateDelivrance }) => (
  <div>
    <a href={url}>
      <Icon slug="download">{label || "télécharger"}</Icon>
    </a>
    {dateDelivrance && (
      <p className={clsx(styles["date-delivrance"], "fr-text--xs fr-my-0")}>
        délivrée le {formatDate(dateDelivrance)}
      </p>
    )}
  </div>
);
