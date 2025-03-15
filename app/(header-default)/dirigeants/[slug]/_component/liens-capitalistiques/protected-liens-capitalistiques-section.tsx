'use client';

import { Select } from '#components-ui/select';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import { ILiensCapitalistiquesProtected } from '#models/espace-agent/liens-capitalistiques';
import {
  IEtatCivilLiensCapitalistiques,
  IPersonneMoraleLiensCapitalistiques,
} from '#models/rne/types';
import { UseCase } from '#models/use-cases';
import EtatCivilInfos from 'app/(header-default)/dirigeants/[slug]/_component/sections/entreprise/EtatCivilInfos';
import PersonneMoraleInfos from 'app/(header-default)/dirigeants/[slug]/_component/sections/entreprise/PersonneMoraleInfos';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { ChangeEvent, useMemo, useState } from 'react';

export default function ProtectedLiensCapitalistiques({
  uniteLegale,
  session,
  useCase,
  title,
  id,
  sources,
  isProtected,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
  useCase: UseCase;
  title: string;
  id: string;
  sources: EAdministration[];
  isProtected: boolean;
}) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear - 2);

  const options = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => {
        const year = currentYear - 1 - i;
        return { value: year.toString(), label: year.toString() };
      }),
    [currentYear]
  );
  const params = useMemo(
    () => ({
      params: { year: selectedYear, useCase },
    }),
    [selectedYear, useCase]
  );
  const liensCapitalistiquesProtected = useAPIRouteData(
    APIRoutesPaths.EspaceAgentLiensCapitalistiquesProtected,
    uniteLegale.siren,
    session,
    params
  );

  return (
    <AsyncDataSectionClient
      title={title}
      id={id}
      isProtected={isProtected}
      sources={sources}
      data={liensCapitalistiquesProtected}
      notFoundInfo="Les liens capitalistiques n’ont pas été trouvés pour cette structure."
    >
      {(liens: ILiensCapitalistiquesProtected) => (
        <>
          <Select
            options={options}
            defaultValue={selectedYear.toString()}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setSelectedYear(parseInt(e.target.value, 10));
            }}
          />
          <LiensCapitalistiquesContent liens={liens} />
        </>
      )}
    </AsyncDataSectionClient>
  );
}

function LiensCapitalistiquesContent({
  liens,
}: {
  liens: ILiensCapitalistiquesProtected;
}) {
  if (!liens || liens.length === 0) {
    return (
      <p>
        Aucun lien capitalistique n&apos;a été déclaré pour cette structure.
      </p>
    );
  }

  const formatLienInfo = (
    lien: IPersonneMoraleLiensCapitalistiques | IEtatCivilLiensCapitalistiques
  ) => {
    if ('denomination' in lien) {
      return [
        <PersonneMoraleInfos dirigeant={lien} />,
        <strong>{lien.pourcentage}%</strong>,
        <div>{lien.nombre_parts} parts</div>,
      ];
    } else {
      return [
        <EtatCivilInfos dirigeant={lien} />,
        <strong>{lien.pourcentage}%</strong>,
        <div>{lien.nombre_parts} parts</div>,
      ];
    }
  };

  return (
    <>
      <p>
        Cette entreprise possède les liens capitalistiques suivants déclarés
        auprès de la <strong>Direction Générale des Finances Publiques</strong>{' '}
        :
      </p>
      <FullTable
        verticalAlign="top"
        head={['Détenteur', 'Pourcentage de détention', 'Nombre de parts']}
        body={liens.map((lien) => formatLienInfo(lien))}
      />
    </>
  );
}
