'use client';

import { Tag } from '#components-ui/tag';
import { DataSubvention } from '#components/administrations';
import { DataSectionClient } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAssociation } from '#models/core/types';
import { ISession } from '#models/user/session';
import { formatCurrency } from '#utils/helpers';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

export const SubventionsAssociationSection: React.FC<{
  uniteLegale: IAssociation;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const subventions = useAPIRouteData(
    'subventions-association',
    uniteLegale.siren,
    session
  );
  if (!subventions) return null;

  return (
    <DataSectionClient
      notFoundInfo="Aucune demande de subvention n’a été trouvée pour cette association."
      title="Détail des subventions"
      sources={[EAdministration.DATA_SUBVENTION]}
      data={subventions}
    >
      {(subventions) =>
        subventions.length === 0 ? (
          <>
            Aucune demande de subvention n’a été trouvée pour cette association.
          </>
        ) : (
          <>
            <p>
              Voici le détail des subventions demandées par l’association. Ces
              données sont collectées par <DataSubvention />.
            </p>
            <FullTable
              head={['Année', 'Dispositif', 'Montant', 'Status', 'Label']}
              body={subventions.map((subvention) => [
                <strong>{subvention.year}</strong>,
                <strong>{subvention.description}</strong>,
                formatCurrency(subvention.amount),
                // TODO Component
                <Tag
                  color={
                    subvention.status === 'Accordé'
                      ? 'success'
                      : subvention.status === 'Refusé'
                      ? 'error'
                      : 'new'
                  }
                >
                  {subvention.status}
                </Tag>,
                // TODO Component
                <Tag
                  color={
                    subvention.status === 'Accordé'
                      ? 'success'
                      : subvention.status === 'Refusé'
                      ? 'error'
                      : 'new'
                  }
                >
                  {subvention.label}
                </Tag>,
              ])}
            />
          </>
        )
      }
    </DataSectionClient>
  );
};
