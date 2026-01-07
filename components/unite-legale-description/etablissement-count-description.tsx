import type React from "react";
import { Link } from "#components/Link";
import type { IUniteLegale } from "#models/core/types";

export const UniteLegaleEtablissementCountDescription: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const { nombreEtablissements, nombreEtablissementsOuverts, usePagination } =
    uniteLegale.etablissements;

  const hasOpenEtablissements = nombreEtablissementsOuverts > 0;

  const plural = nombreEtablissements > 1 ? "s" : "";
  const pluralBe = nombreEtablissementsOuverts > 1 ? "sont" : "est";

  return (
    <>
      <Link href={`/entreprise/${uniteLegale.chemin}#etablissements`}>
        {nombreEtablissements} établissement{plural}
      </Link>
      {hasOpenEtablissements &&
        (!usePagination || uniteLegale.isNbEtablissementOuvertReliable) &&
        nombreEtablissements !== nombreEtablissementsOuverts && (
          <strong>
            {" "}
            dont {nombreEtablissementsOuverts} {pluralBe} en activité
          </strong>
        )}
    </>
  );
};
