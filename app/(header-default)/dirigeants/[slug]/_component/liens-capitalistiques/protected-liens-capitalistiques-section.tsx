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
import { formatIntFr, pluralize } from '#utils/helpers/formatting/formatting';
import EtatCivilInfos from 'app/(header-default)/dirigeants/[slug]/_component/sections/entreprise/EtatCivilInfos';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { ChangeEvent, useMemo, useState } from 'react';
import PersonneMoraleInfos from '../sections/entreprise/PersonneMoraleInfos';

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
      <p>
        Les actionnaires et filiales déclarés pour cette année n‘ont pas été
        retrouvés.
      </p>
    );
  }

  if (hasAnyError(liensCapitalistiquesProtected)) {
    return (
      <i>Impossible de télécharger les données pour l’année {selectedYear}.</i>
    );
  }

  const formatLienActionnaireInfo = (
    lien: IPersonneMoraleLiensCapitalistiques | IEtatCivilLiensCapitalistiques
  ) => {
    if ('denomination' in lien) {
      return [
        <PersonneMoraleInfos dirigeant={lien} />,
        <div>{lien.pourcentage}%</div>,
        <div>{lien.pays}</div>,
      ];
    } else {
      return [
        <EtatCivilInfos dirigeant={lien} />,
        <div>{lien.pourcentage}%</div>,
        <div>{lien.pays}</div>,
      ];
    }
  };

  const formatLienFilialeInfo = (lien: IPersonneMoraleLiensCapitalistiques) => {
    return [
      <div>{lien.denomination}</div>,
      <div>
        <a href={`/entreprise/${lien.siren}`}>{formatIntFr(lien.siren)}</a>
      </div>,
      <div>{lien.natureJuridique}</div>,
      <div>{lien.pourcentage}%</div>,
      <div>{lien.pays}</div>,
    ];
  };

  const pluralActionnaires = pluralize(
    liensCapitalistiquesProtected.actionnaires
  );
  const pluralFiliales = pluralize(liensCapitalistiquesProtected.filiales);
  const pluralActionnairesEtFiliales =
    liensCapitalistiquesProtected.actionnaires.length +
      liensCapitalistiquesProtected.filiales.length >
    1
      ? 's'
      : '';

  return (
    <>
      <p>
        Les données transmises sont déclaratives et proviennent de deux CERFA
        des liasses fiscales déposées auprès de la <DGFiP /> :
        <ul>
          <li>
            CERFA 2059F : Composition du capital social (actionnaires,
            répartition, etc.)
          </li>
          <li>CERFA 2059G : Participations (filiales et leurs adresses).</li>
        </ul>
      </p>
      <p>
        Cette entreprise possède{' '}
        {liensCapitalistiquesProtected.actionnaires.length} actionnaire
        {pluralActionnaires} et {liensCapitalistiquesProtected.filiales.length}{' '}
        filiale{pluralFiliales} déclaré{pluralActionnairesEtFiliales} pour
        l‘année {selectedYear} :
      </p>

      <h3>Composition du capital</h3>
      <FullTable
        verticalAlign="top"
        head={['Actionnaire', 'Pourcentage de détention', 'Pays']}
        body={liensCapitalistiquesProtected.actionnaires.map((actionnaire) =>
          formatLienActionnaireInfo(actionnaire)
        )}
      />
      <br />
      <h3>Liste des participations</h3>
      <FullTable
        verticalAlign="top"
        head={[
          'Dénomination',
          'SIREN',
          'Type',
          'Pourcentage de détention',
          'Pays',
        ]}
        body={liensCapitalistiquesProtected.filiales.map((filiale) =>
          formatLienFilialeInfo(filiale)
        )}
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

  const options = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const creationYear = new Date(uniteLegale.dateCreation).getFullYear();

    const yearsToDisplay = currentYear - creationYear + 1;

    return Array.from({ length: yearsToDisplay }, (_, i) => {
      const year = currentYear - i;
      return { value: year.toString(), label: year.toString() };
    });
  }, [uniteLegale.dateCreation]);

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
          Sélectionnez une année pour voir les actionnaires et filiales de
          l‘entreprise.
        </i>
      )}
    </Section>
  );
}
