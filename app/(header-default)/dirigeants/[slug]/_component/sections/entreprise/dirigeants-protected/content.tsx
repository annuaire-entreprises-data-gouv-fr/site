import { FullTable } from "#components/table/full";
import { SeePersonPageLink } from "#components-ui/see-personn-page-link";
import type { IUniteLegale } from "#models/core/types";
import type {
  IDirigeantsWithMetadataMergedIGInpi,
  IEtatCivilMergedIGInpi,
  IPersonneMoraleMergedIGInpi,
} from "#models/rne/types";
import { isPersonneMorale } from "#utils/helpers/is-personne-morale";
import DisambiguationTooltip from "../DisambiguationTooltip";
import { sortDirigeants } from "../dirigeants-open/content";
import EtatCivilInfos from "../EtatCivilInfos";
import PersonneMoraleInfos from "../PersonneMoraleInfos";
import RolesInfos from "../RolesInfos";

type IDirigeantContentProps = {
  dirigeants: IDirigeantsWithMetadataMergedIGInpi;
  uniteLegale: IUniteLegale;
};

export default function DirigeantsContentProtected({
  dirigeants,
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

  return (
    <FullTable
      body={dirigeants.data
        .sort(sortDirigeants)
        .map((dirigeant) => formatDirigeant(dirigeant))}
      head={["Role", "Details", "Action"]}
    />
  );
}
