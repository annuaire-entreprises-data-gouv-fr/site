import Link from "next/link";
import { Icon } from "#components-ui/icon/wrapper";

export function ExportSirene() {
  return (
    <Link className="fr-link" href="/export-sirene">
      <Icon slug="download">Export Sirene</Icon>
    </Link>
  );
}
