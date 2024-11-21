import FAQLink from '#components-ui/faq-link';
import { SeePersonPageLink } from '#components-ui/see-personn-page-link';
import { FullTable } from '#components/table/full';
import { IUniteLegale } from '#models/core/types';
import {
  IDirigeantsWithMetadataMergedIGInpi,
  IEtatCivilMergedIGInpi,
  IPersonneMoraleMergedIGInpi,
} from '#models/rne/types';
import { isPersonneMorale } from '#utils/helpers/is-personne-morale';
import React from 'react';
import EtatCivilInfos from '../EtatCivilInfos';
import PersonneMoraleInfos from '../PersonneMoraleInfos';

type IDirigeantContentProps = {
  dirigeants: IDirigeantsWithMetadataMergedIGInpi;
  uniteLegale: IUniteLegale;
};

const DisambiguationTooltip = ({
  dataType,
  isInIg,
  isInInpi,
}: {
  dataType: string;
  isInIg?: boolean;
  isInInpi?: boolean;
}) => {
  if (isInIg && isInInpi) {
    return null;
  }

  return (
    <>
      <br />
      {'('}
      {!isInIg && (
        <FAQLink tooltipLabel="incohérence possible">
          Ce {dataType} n‘apparait pas dans les données d‘Infogreffe.
        </FAQLink>
      )}
      {!isInInpi && (
        <FAQLink tooltipLabel="incohérence possible">
          Ce {dataType} n‘apparait pas dans les données de l‘INPI.
        </FAQLink>
      )}
      {')'}
    </>
  );
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
        dirigeant.roles?.map((role, index) => (
          <React.Fragment key={index}>
            <span>{role.label}</span>
            <DisambiguationTooltip
              dataType="rôle"
              isInIg={role.isInIg}
              isInInpi={role.isInInpi}
            />
            {index < dirigeant.roles.length - 1 && ', '}
          </React.Fragment>
        )),
        <>
          <PersonneMoraleInfos dirigeant={dirigeant} />,
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
          <a key={dirigeant.siren} href={`/dirigeants/${dirigeant.siren}`}>
            → voir les dirigeants de {defaultDenom}
          </a>
        );
      }
      return infos;
    } else {
      const infos = [
        dirigeant.roles?.map((role, index) => (
          <React.Fragment key={index}>
            <span>{role.label}</span>
            <DisambiguationTooltip
              dataType="rôle"
              isInIg={role.isInIg}
              isInInpi={role.isInInpi}
            />
            {index < dirigeant.roles.length - 1 && ', '}
          </React.Fragment>
        )),
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
    }
  };

  return (
    <FullTable
      head={['Role', 'Details', 'Action']}
      body={dirigeants.data.map((dirigeant) => formatDirigeant(dirigeant))}
    />
  );
}
