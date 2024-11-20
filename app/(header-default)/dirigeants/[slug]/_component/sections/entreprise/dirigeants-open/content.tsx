import { SeePersonPageLink } from '#components-ui/see-personn-page-link';
import { FullTable } from '#components/table/full';
import { IUniteLegale } from '#models/core/types';
import {
  IDirigeantsWithMetadata,
  IEtatCivil,
  IPersonneMorale,
} from '#models/rne/types';
import { isPersonneMorale } from '../../is-personne-morale';
import EtatCivilInfos from '../EtatCivilInfos';
import PersonneMoraleInfos from '../PersonneMoraleInfos';

type IDirigeantContentProps = {
  dirigeants: IDirigeantsWithMetadata;
  uniteLegale: IUniteLegale;
};

export default function DirigeantsContent({
  dirigeants,
  uniteLegale,
}: IDirigeantContentProps) {
  const formatDirigeant = (dirigeant: IEtatCivil | IPersonneMorale) => {
    if (isPersonneMorale(dirigeant)) {
      const infos = [
        <>{dirigeant.role}</>,
        <PersonneMoraleInfos dirigeant={dirigeant} />,
      ];

      if (dirigeant.siren) {
        const defaultDenom = dirigeant.denomination || dirigeant.siren;
        infos.push(
          <a key={dirigeant.siren} href={`/dirigeants/${dirigeant.siren}`}>
            → voir les dirigeants de {defaultDenom}
          </a>
        );
      }
      return infos;
    } else {
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
    }
  };

  return (
    <FullTable
      head={['Role', 'Details', 'Action']}
      body={dirigeants.data.map((dirigeant) => formatDirigeant(dirigeant))}
    />
  );
}
