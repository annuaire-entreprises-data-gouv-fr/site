"use client";

import routes from "#clients/routes";
import { INPI } from "#components/administrations";
import { Link } from "#components/Link";
import { FullTable } from "#components/table/full";
import { UniteLegalePageLink } from "#components/unite-legale-page-link";
import InpiPartiallyDownWarning from "#components-ui/alerts-with-explanations/inpi-partially-down";
import { SeePersonPageLink } from "#components-ui/see-personn-page-link";
import type { IUniteLegale } from "#models/core/types";
import type {
  IDirigeantsWithMetadata,
  IEtatCivil,
  IPersonneMorale,
} from "#models/rne/types";
import { pluralize } from "#utils/helpers";
import { isPersonneMorale } from "#utils/helpers/is-personne-morale";
import EtatCivilInfos from "../EtatCivilInfos";
import PersonneMoraleInfos from "../PersonneMoraleInfos";

type IDirigeantContentProps = {
  data: IDirigeantsWithMetadata;
  uniteLegale: IUniteLegale;
};

export default function DirigeantsContent({
  data: dirigeants,
  uniteLegale,
}: IDirigeantContentProps) {
  const plural = pluralize(dirigeants.data);

  const formatDirigeant = (dirigeant: IEtatCivil | IPersonneMorale) => {
    if (isPersonneMorale(dirigeant)) {
      const infos = [
        <>{dirigeant.role}</>,
        <PersonneMoraleInfos dirigeant={dirigeant} />,
      ];

      if (dirigeant.siren) {
        const defaultDenom = dirigeant.denomination || dirigeant.siren;
        infos.push(
          <Link href={`/dirigeants/${dirigeant.siren}`} key={dirigeant.siren}>
            → voir les dirigeants de {defaultDenom}
          </Link>
        );
      }
      return infos;
    }
    const infos = [
      <>{dirigeant.role}</>,
      <EtatCivilInfos dirigeant={dirigeant} />,
    ];

    if (dirigeant.dateNaissancePartial) {
      infos.push(
        <SeePersonPageLink person={dirigeant} sirenFrom={uniteLegale.siren} />
      );
    }
    return infos;
  };

  return (
    <>
      {dirigeants.metadata?.isFallback && <InpiPartiallyDownWarning />}
      {dirigeants.data.length === 0 ? (
        <p>
          Cette entreprise est enregistrée au{" "}
          <strong>Registre National des Entreprises (RNE)</strong>, mais n’y
          possède aucun dirigeant.
        </p>
      ) : (
        <>
          <p>
            Cette entreprise possède {dirigeants.data.length} dirigeant
            {plural} enregistré{plural} au{" "}
            <strong>Registre National des Entreprises (RNE)</strong> tenu par l’
            <INPI />. Pour en savoir plus, vous pouvez consulter{" "}
            <UniteLegalePageLink
              href={`${routes.rne.portail.entreprise}${uniteLegale.siren}`}
              siteName="le site de l’INPI"
              uniteLegale={uniteLegale}
            />
            .
          </p>
          <p>
            <strong>NB :</strong> si vous êtes agent public, vous pouvez accéder
            à l'état civil complet (lieu et date de naissance complète) en vous
            connectant à{" "}
            <Link href="/lp/agent-public">l'espace agent public</Link>.
          </p>
          <FullTable
            body={dirigeants.data
              .sort(sortDirigeants)
              .map((dirigeant) => formatDirigeant(dirigeant))}
            head={["Role", "Details", "Action"]}
          />
        </>
      )}
    </>
  );
}

export function sortDirigeants(
  a: IEtatCivil | IPersonneMorale,
  b: IEtatCivil | IPersonneMorale
): -1 | 1 | 0 {
  const estDemissionnaireA =
    "estDemissionnaire" in a ? a.estDemissionnaire : false;
  const estDemissionnaireB =
    "estDemissionnaire" in b ? b.estDemissionnaire : false;

  if (estDemissionnaireA && !estDemissionnaireB) {
    return 1;
  }
  if (!estDemissionnaireA && estDemissionnaireB) {
    return -1;
  }

  const roleA = a.role;
  const roleB = b.role;
  if (roleA === roleB) {
    if (isPersonneMorale(a) && isPersonneMorale(b)) {
      // same role, sort by denomination
      return a.denomination < b.denomination ? -1 : 1;
    }
    if (!isPersonneMorale(a) && !isPersonneMorale(b)) {
      // same role, sort by name
      if (a.nom === b.nom) {
        if (a.prenoms === b.prenoms) {
          return 0;
        }
        return a.prenoms < b.prenoms ? -1 : 1;
      }
      return a.nom < b.nom ? -1 : 1;
    }
  }
  if (roleA == null) {
    return 1;
  }
  if (roleB == null) {
    return -1;
  }
  if (roleA.match(/^[\d]+/) && roleB.match(/^[\d]+/)) {
    return Number.parseInt(roleA, 10) < Number.parseInt(roleB, 10) ? -1 : 1;
  }
  return roleA < roleB ? -1 : 1;
}
