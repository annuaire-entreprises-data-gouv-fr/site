'use client';

import routes from '#clients/routes';
import FAQLink from '#components-ui/faq-link';
import { Select } from '#components-ui/select';
import { Tag } from '#components-ui/tag';
import { DJEPVA } from '#components/administrations';
import AgentWall from '#components/espace-agent-components/agent-wall';
import NonRenseigne from '#components/non-renseigne';
import { DataSectionClient } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { ISession } from '#models/authentication/user/session';
import { IAssociation } from '#models/core/types';
import { isDataSuccess, isUnauthorized } from '#models/data-fetching';
import { ISubvention, ISubventions } from '#models/subventions/association';
import { formatCurrency, Siren } from '#utils/helpers';
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

const SubventionDetails: React.FC<{
  subventions: ISubventions;
  siren: Siren;
}> = ({ subventions, siren }) => {
  const subventionStats = useMemo(() => {
    const totalSubventions = subventions.length;
    const mostRecentYear = subventions[totalSubventions - 1]?.year;
    const approvedSubventions = subventions.filter(
      (subvention) => subvention.label === 'Accordé'
    );
    const totalApproved = approvedSubventions.length;
    const totalAmount = approvedSubventions.reduce(
      (acc, subvention) => acc + (subvention?.amount || 0),
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
      <p>
        Pour en savoir plus, vous pouvez consulter{' '}
        <a
          href={routes.dataSubvention.pageBySirenOrIdRna(siren)}
          aria-label={`Voir la page de l’association sur le site de data.subvention`}
          rel="noreferrer noopener"
          target="_blank"
        >
          la page de l’association sur le site de data.subvention
        </a>
        .
      </p>
    </>
  );
};

export default function SubventionsAssociationSection({
  uniteLegale,
  session,
}: {
  uniteLegale: IAssociation;
  session: ISession | null;
}) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
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
    return [
      ...new Set(
        subventions
          .filter((s) => (selectedStatus ? s.label === selectedStatus : true))
          .map((s) => s.year)
      ),
    ].map((y) => {
      return {
        value: y.toString(),
        label: y.toString(),
      };
    });
  }, [subventions, selectedStatus]);

  const allStatuses = useMemo(() => {
    if (!isDataSuccess(subventions)) {
      return [];
    }
    return [
      ...new Set(
        subventions
          .filter(
            (s) =>
              (selectedYear ? s.year === selectedYear : true) && s.label !== ''
          )
          .map((s) => s.label)
      ),
    ].map((y) => {
      return {
        value: y,
        label: y,
      };
    });
  }, [subventions, selectedYear]);

  useEffect(() => {
    if (isDataSuccess(subventions)) {
      if (selectedYear === null && selectedStatus === '') {
        return setFilteredSubventions(subventions);
      }
      setFilteredSubventions(
        subventions.filter(
          (s) =>
            (selectedYear ? s.year === selectedYear : true) &&
            (selectedStatus ? s.label === selectedStatus : true)
        )
      );
    }
  }, [subventions, selectedYear, selectedStatus]);

  if (isUnauthorized(subventions)) {
    return <AgentWall id="detail-des-subventions" title="Subventions reçues" />;
  }

  return (
    <DataSectionClient
      id="detail-des-subventions"
      title="Subventions reçues"
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
            <SubventionDetails
              subventions={subventions}
              siren={uniteLegale.siren}
            />
            <div className="layout-right" style={{ marginBottom: '20px' }}>
              <ul className="fr-btns-group fr-btns-group--inline-md fr-btns-group--center">
                <li style={{ marginRight: '10px' }}>
                  <Select
                    options={allYears}
                    name="Filtrer par année"
                    defaultValue={''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setSelectedYear(parseInt(e.target.value, 10));
                    }}
                    placeholder="Toutes les années"
                  />
                </li>
                <li>
                  <Select
                    options={allStatuses}
                    name="Filtrer par état"
                    defaultValue={''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setSelectedStatus(e.target.value);
                    }}
                    placeholder="Tous les états"
                  />
                </li>
              </ul>
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
                typeof subvention.amount === 'undefined' ? (
                  <NonRenseigne />
                ) : (
                  formatCurrency(subvention.amount)
                ),
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
}
