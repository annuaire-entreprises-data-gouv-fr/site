import type React from "react";
import NonRenseigne from "#components/non-renseigne";
import { Section } from "#components/section";
import { FullTable } from "#components/table/full";
import { EAdministration } from "#models/administrations/EAdministration";
import {
  type IUniteLegale,
  isCollectiviteTerritoriale,
} from "#models/core/types";
import type { IEtatCivil } from "#models/rne/types";
import { capitalize, formatDatePartial, pluralize } from "#utils/helpers";

/**
 * Elus section
 * @param param0
 * @returns
 */
const ElusSection: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => {
  let elus = [] as IEtatCivil[];

  if (isCollectiviteTerritoriale(uniteLegale)) {
    elus = uniteLegale?.colter?.elus || [];
  }

  const formatElus = (elu: IEtatCivil) => {
    const nomComplet = `${elu.prenoms}${elu.prenoms && elu.nom ? " " : ""}${
      elu.nom
    }`;

    const infos = [
      elu.role ?? <NonRenseigne />,
      <>{nomComplet}</>,
      <span>
        {capitalize(formatDatePartial(elu.dateNaissancePartial) ?? "") || (
          <NonRenseigne />
        )}
      </span>,
    ];

    return infos;
  };

  const plural = pluralize(elus);

  return (
    <Section
      id="collectivite-elus"
      sources={[EAdministration.MI, EAdministration.DINUM]}
      title={`Élu${plural}`}
    >
      {elus.length > 0 ? (
        <>
          <p>
            Cette collectivité possède {elus.length} élu{plural} enregistré
            {plural} au Répertoire National des Élus&nbsp;:
          </p>
          <FullTable
            body={elus.sort(sortElus).map((elu) => formatElus(elu))}
            head={["Role", "Élu(e)", "Date de naissance"]}
          />
        </>
      ) : (
        <p>
          Cette collectivité ne possède aucun élu enregistré au Répertoire
          National des Élus
        </p>
      )}
    </Section>
  );
};
export default ElusSection;

function sortElus(a: IEtatCivil, b: IEtatCivil): -1 | 1 | 0 {
  const roleA = a.role;
  const roleB = b.role;
  if (roleA === roleB) {
    // same role, sort by name
    if (a.nom === b.nom) {
      if (a.prenoms === b.prenoms) {
        return 0;
      }
      return a.prenoms < b.prenoms ? -1 : 1;
    }

    return a.nom < b.nom ? -1 : 1;
  }
  if (roleA === "Maire") {
    return -1;
  }
  if (roleB === "Maire") {
    return 1;
  }
  if (roleA == null) {
    return 1;
  }
  if (roleB == null) {
    return -1;
  }
  if (roleA.match(/^[\d]+/) && roleB.match(/^[\d]+/)) {
    return parseInt(roleA, 10) < parseInt(roleB, 10) ? -1 : 1;
  }
  return roleA < roleB ? -1 : 1;
}
