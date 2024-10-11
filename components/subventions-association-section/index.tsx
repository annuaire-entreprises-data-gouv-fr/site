'use client';

import { Tag } from '#components-ui/tag';
import { DataSubvention } from '#components/administrations';
import AgentWallSubventionsAssociation from '#components/espace-agent-components/agent-wall/subventions-association';
import { DataSectionClient } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAssociation } from '#models/core/types';
import { ISubventions } from '#models/subventions/association';
import { AppScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { formatCurrency } from '#utils/helpers';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { useMemo } from 'react';

const SubventionDetails: React.FC<{ subventions: ISubventions }> = ({
  subventions,
}) => {
  const subventionStats = useMemo(() => {
    const totalSubventions = subventions.length;
    const mostRecentYear = subventions[totalSubventions - 1]?.year;
    const approvedSubventions = subventions.filter(
      (subvention) => subvention.label === 'Accordé'
    );
    const totalApproved = approvedSubventions.length;
    const totalAmount = approvedSubventions.reduce(
      (acc, subvention) => acc + subvention.amount,
      0
    );

    return {
      totalSubventions,
      mostRecentYear,
      totalApproved,
      totalAmount,
    };
  }, [subventions]);

  return (
    <p>
      Cette association a demandé {subventionStats.totalSubventions}{' '}
      subvention(s) depuis {subventionStats.mostRecentYear} dont{' '}
      <b>{subventionStats.totalApproved} accordée(s)</b> pour un total de{' '}
      <b>{formatCurrency(subventionStats.totalAmount)}</b>. Ces données sont
      collectées par <DataSubvention />.
    </p>
  );
};

export const SubventionsAssociationSection: React.FC<{
  uniteLegale: IAssociation;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const subventions = useAPIRouteData(
    'subventions-association',
    uniteLegale.siren,
    session
  );

  if (!hasRights(session, AppScope.none)) {
    return (
      <AgentWallSubventionsAssociation
        title="Détail des subventions"
        id="detail-des-subventions"
        uniteLegale={uniteLegale}
      />
    );
  }

  return (
    <DataSectionClient
      id="detail-des-subventions"
      title="Détail des subventions"
      sources={[EAdministration.DATA_SUBVENTION]}
      notFoundInfo="Aucune demande de subvention n’a été trouvée pour cette association."
      data={subventions}
      isProtected
    >
      {(subventions) =>
        !subventions || subventions?.length === 0 ? (
          <>
            Aucune demande de subvention n’a été trouvée pour cette association.
          </>
        ) : (
          <>
            <SubventionDetails subventions={subventions} />
            <FullTable
              head={['Année', 'Dispositif', 'Montant', 'Label']}
              body={subventions.map((subvention) => [
                <strong>{subvention.year}</strong>,
                <strong>{subvention.description}</strong>,
                formatCurrency(subvention.amount),
                subvention.label && (
                  <Tag
                    color={
                      subvention.label === 'Accordé'
                        ? 'success'
                        : subvention.label === 'Refusé'
                        ? 'error'
                        : 'new'
                    }
                  >
                    {subvention.label}
                  </Tag>
                ),
              ])}
            />
          </>
        )
      }
    </DataSectionClient>
  );
};
