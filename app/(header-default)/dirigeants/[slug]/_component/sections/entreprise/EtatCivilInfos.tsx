import type { IEtatCivil } from "#models/rne/types";
import { formatDateLong, formatDatePartial } from "#utils/helpers";

export default function EtatCivilInfos({
  dirigeant,
}: {
  dirigeant: IEtatCivil;
}) {
  const nomComplet = `${dirigeant.prenoms || ""}${
    dirigeant.prenoms && dirigeant.nom ? " " : ""
  }${(dirigeant.nom || "").toUpperCase()}`;

  return (
    <>
      {nomComplet}
      {dirigeant.dateNaissance || dirigeant.dateNaissancePartial
        ? `, né(e) ${
            dirigeant.dateNaissance
              ? "le " + formatDateLong(dirigeant.dateNaissance)
              : "en " + formatDatePartial(dirigeant.dateNaissancePartial)
          }${dirigeant.lieuNaissance ? `, à ${dirigeant.lieuNaissance}` : ""}`
        : ""}
    </>
  );
}
