"use client";

import routes from "#clients/routes";
import { INPI } from "#components/administrations";
import { FullTable } from "#components/table/full";
import { UniteLegalePageLink } from "#components/unite-legale-page-link";
import { Info } from "#components-ui/alerts";
import InpiPartiallyDownWarning from "#components-ui/alerts-with-explanations/inpi-partially-down";
import { SeePersonPageLink } from "#components-ui/see-personn-page-link";
import type { IUniteLegale } from "#models/core/types";
import type {
  IDirigeantsWithMetadataMergedIGInpi,
  IEtatCivilMergedIGInpi,
  IPersonneMoraleMergedIGInpi,
} from "#models/rne/types";
import { pluralize } from "#utils/helpers";
import { isPersonneMorale } from "#utils/helpers/is-personne-morale";
import DisambiguationTooltip from "../DisambiguationTooltip";
import { sortDirigeants } from "../dirigeants-open/content";
import EtatCivilInfos from "../EtatCivilInfos";
import PersonneMoraleInfos from "../PersonneMoraleInfos";
import RolesInfos from "../RolesInfos";

type IDirigeantContentProps = {
  data: IDirigeantsWithMetadataMergedIGInpi;
  uniteLegale: IUniteLegale;
};

export default function DirigeantsContentProtected({
  data: dirigeants,
  uniteLegale,
}: IDirigeantContentProps) {
  const formatDirigeant = (
    dirigeant: IEtatCivilMergedIGInpi | IPersonneMoraleMergedIGInpi
  ) => {
    if (isPersonneMorale(dirigeant)) {
      const infos = [
        <RolesInfos roles={dirigeant.roles} />,
        <>
          <PersonneMoraleInfos dirigeant={dirigeant} />
          <DisambiguationTooltip
            dataType="dirigeant"
            isInIg={dirigeant.isInIg}
            isInInpi={dirigeant.isInInpi}
          />
        </>,
      ];

      if (dirigeant.siren) {
        const defaultDenom = dirigeant.denomination || dirigeant.siren;
        infos.push(
          <a href={`/dirigeants/${dirigeant.siren}`} key={dirigeant.siren}>
            → voir les dirigeants de {defaultDenom}
          </a>
        );
      }
      return infos;
    }
    const infos = [
      <RolesInfos roles={dirigeant.roles} />,
      <>
        <EtatCivilInfos dirigeant={dirigeant} />
        <DisambiguationTooltip
          dataType="dirigeant"
          isInIg={dirigeant.isInIg}
          isInInpi={dirigeant.isInInpi}
        />
      </>,
    ];

    if (dirigeant.dateNaissancePartial) {
      infos.push(
        <SeePersonPageLink person={dirigeant} sirenFrom={uniteLegale.siren} />
      );
    }
    return infos;
  };
  const plural = pluralize(dirigeants.data);

  return (
    <>
      {dirigeants.metadata?.isFallback && <InpiPartiallyDownWarning />}

      <Info>
        Ces informations proviennent du RNE et sont issues d‘une comparaison
        entre les données issues de l’
        <INPI /> et celles d’Infogreffe (qui procure les dates de naissance
        complètes).
      </Info>

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
            &nbsp;:
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
