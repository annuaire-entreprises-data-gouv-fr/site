'use client';

import { Loader } from '#components-ui/loader';
import { Select } from '#components-ui/select';
import { DGFiP } from '#components/administrations';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { isAPI404 } from '#models/api-not-responding';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import { hasAnyError, isDataLoading } from '#models/data-fetching';
import {
  IEtatCivilLiensCapitalistiques,
  IPersonneMoraleLiensCapitalistiques,
} from '#models/rne/types';
import { UseCase } from '#models/use-cases';
import { pluralize } from '#utils/helpers/formatting/formatting';
import EtatCivilInfos from 'app/(header-default)/dirigeants/[slug]/_component/sections/entreprise/EtatCivilInfos';
import PersonneMoraleInfos from 'app/(header-default)/dirigeants/[slug]/_component/sections/entreprise/PersonneMoraleInfos';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { ChangeEvent, useMemo, useState } from 'react';

function LiensCapitalistiquesContent({
  uniteLegale,
  session,
  selectedYear,
  useCase,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
  selectedYear: string;
  useCase: UseCase;
}) {
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

  if (isDataLoading(liensCapitalistiquesProtected)) {
    return <Loader />;
  }

  if (isAPI404(liensCapitalistiquesProtected)) {
    return (
      <p>Les actionnaires déclarés pour cette année n‘ont pas été retrouvés.</p>
    );
  }

  if (hasAnyError(liensCapitalistiquesProtected)) {
    return (
      <i>Impossible de télécharger les données pour l’année {selectedYear}.</i>
    );
  }

  const formatLienInfo = (
    lien: IPersonneMoraleLiensCapitalistiques | IEtatCivilLiensCapitalistiques
  ) => {
    if ('denomination' in lien) {
      return [
        <PersonneMoraleInfos dirigeant={lien} />,
        <div>{lien.pourcentage}%</div>,
        <div>{lien.nombre_parts} parts</div>,
      ];
    } else {
      return [
        <EtatCivilInfos dirigeant={lien} />,
        <div>{lien.pourcentage}%</div>,
        <div>{lien.nombre_parts} parts</div>,
      ];
    }
  };

  const plural = pluralize(liensCapitalistiquesProtected);

  return (
    <>
      <p>
        Cette entreprise possède {liensCapitalistiquesProtected.length}{' '}
        actionnaire{plural} déclaré{plural} dans la liasse fiscale de la{' '}
        <DGFiP /> pour l‘année {selectedYear} :
      </p>
      <FullTable
        verticalAlign="top"
        head={['Détenteur', 'Pourcentage de détention', 'Nombre de parts']}
        body={liensCapitalistiquesProtected.map((lien) => formatLienInfo(lien))}
      />
    </>
  );
}

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
  const [selectedYear, setSelectedYear] = useState<null | string>(null);

  const options = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const year = new Date().getFullYear() - 1 - i;
        return { value: year.toString(), label: year.toString() };
      }),
    []
  );

  return (
    <Section title={title} id={id} isProtected={isProtected} sources={sources}>
      <Select
        options={options}
        placeholder="Sélectionnez une année"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setSelectedYear(e.target.value);
        }}
      />
      {selectedYear ? (
        <LiensCapitalistiquesContent
          uniteLegale={uniteLegale}
          session={session}
          selectedYear={selectedYear}
          useCase={useCase}
        />
      ) : (
        <i>
          Sélectionnez une année pour voir les actionnaires de l‘entreprise.
        </i>
      )}
    </Section>
  );
}
