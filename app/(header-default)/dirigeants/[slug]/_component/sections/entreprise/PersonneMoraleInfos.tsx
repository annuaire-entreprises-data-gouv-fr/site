import { Link } from "#components/Link";
import type { IPersonneMorale } from "#models/rne/types";
import { formatIntFr } from "#utils/helpers";

export default function PersonneMoraleInfos({
  dirigeant,
}: {
  dirigeant: IPersonneMorale;
}) {
  return (
    <>
      <strong>{dirigeant.denomination}</strong>
      {dirigeant.siren ? (
        <>
          {" - "}
          <Link href={`/entreprise/${dirigeant.siren}`}>
            {formatIntFr(dirigeant.siren)}
          </Link>
        </>
      ) : (
        ""
      )}
      {dirigeant.natureJuridique && (
        <>
          <br />
          {dirigeant.natureJuridique}
        </>
      )}
    </>
  );
}
