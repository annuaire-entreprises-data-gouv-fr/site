'use client';

import FAQLink from '#components-ui/faq-link';
import { Select } from '#components-ui/select';
import { Tag } from '#components-ui/tag';
import { DJEPVA } from '#components/administrations';
import NonRenseigne from '#components/non-renseigne';
import { DataSectionClient } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAssociation } from '#models/core/types';
import { isDataSuccess, isUnauthorized } from '#models/data-fetching';
import { ISubvention, ISubventions } from '#models/subventions/association';
import { ISession } from '#models/user/session';
import { formatCurrency } from '#utils/helpers';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

const DataSubventionLink = () => (
  <FAQLink
    tooltipLabel="data.subvention"
    to="https://datasubvention.beta.gouv.fr/"
  >
    Data.subvention est un outil développé par la <DJEPVA />. Il recense les
    subventions demandées et reçues par une association.
    <br />
    Les données sont issues de Chorus et du Fonjep (Fonds de coopération de la
    jeunesse et de l’éducation populaire).
  </FAQLink>
);

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
    <>
      Depuis {subventionStats.mostRecentYear}, cette association compte{' '}
      {subventionStats.totalSubventions} demandes de subventions référencées
      dans <DataSubventionLink />.
      <p>
        Parmi ces subventions :{' '}
        <b>{subventionStats.totalApproved} ont été accordées</b> pour un total
        de <b>{formatCurrency(subventionStats.totalAmount)}</b>. Le reste a été
        refusé, est en cours d’instruction ou se situe dans un état inconnu.
      </p>
    </>
  );
};

export const SubventionsAssociationSection: React.FC<{
  uniteLegale: IAssociation;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [filteredSubventions, setFilteredSubventions] = useState<ISubvention[]>(
    []
  );

  const subventions = useAPIRouteData(
    APIRoutesPaths.SubventionsAssociation,
    uniteLegale.siren,
    session
  );

  const allYears = useMemo(() => {
    if (!isDataSuccess(subventions)) {
      return [];
    }
    return [...new Set(subventions.map((s) => s.year.toString()))].map((y) => {
      return {
        value: y,
        label: y,
      };
    });
  }, [subventions]);

  useEffect(() => {
    if (isDataSuccess(subventions)) {
      if (selectedYear === '') {
        return setFilteredSubventions(subventions);
      }
      setFilteredSubventions(
        subventions.filter((s) => s.year.toString() === selectedYear)
      );
    }
  }, [subventions, selectedYear]);

  if (isUnauthorized(subventions)) {
    // for a start lets hide it first before Data subvention validation
    return null;
    // return (
    // <AgentWall id="detail-des-subventions" title="Détail des subventions" />
    // );
  }

  return (
    <DataSectionClient
      id="detail-des-subventions"
      title="Détail des subventions"
      sources={[EAdministration.DJEPVA]}
      notFoundInfo="Aucune demande de subvention n’a été trouvée pour cette association."
      data={subventions}
      isProtected
    >
      {(subventions) =>
        !subventions || subventions?.length === 0 ? (
          <>
            Aucune demande de subvention n’a été trouvée pour cette association
            dans <DataSubventionLink />.
          </>
        ) : (
          <>
            <SubventionDetails subventions={subventions} />
            <div className="layout-right">
              <Select
                options={allYears}
                name="Filtrer par année"
                defaultValue={selectedYear}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setSelectedYear(e.target.value);
                }}
                placeholder="Toutes les années"
              />
            </div>
            <FullTable
              head={['Année', 'Dispositif', 'Montant', 'État']}
              body={filteredSubventions.map((subvention) => [
                <strong>{subvention.year}</strong>,
                subvention.description ? (
                  <strong>{subvention.description}</strong>
                ) : (
                  <NonRenseigne />
                ),
                formatCurrency(subvention.amount),
                subvention.label ? (
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
                ) : (
                  <Tag color="default">Inconnu</Tag>
                ),
              ])}
            />
          </>
        )
      }
    </DataSectionClient>
  );
};
