import Link from "next/link";
import { Icon } from "#components-ui/icon/wrapper";
import styles from "./export-sirene.module.css";

export function ExportSirene() {
  return (
    <Link className="fr-link" href="/export-sirene">
      <Icon slug="download">
        <span className={styles.exportSireneText}>Export Sirene</span>
      </Icon>
    </Link>
  );
}
