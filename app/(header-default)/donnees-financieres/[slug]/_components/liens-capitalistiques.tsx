'use client';

import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import {
  IEtatCivilLiensCapitalistiques,
  ILiensCapitalistiquesProtected,
  IPersonneMoraleLiensCapitalistiques,
} from '#models/espace-agent/liens-capitalistiques';
import EtatCivilInfos from 'app/(header-default)/dirigeants/[slug]/_component/sections/entreprise/EtatCivilInfos';
import PersonneMoraleInfos from 'app/(header-default)/dirigeants/[slug]/_component/sections/entreprise/PersonneMoraleInfos';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

export default function LiensCapitalistiques({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const liensCapitalistiquesProtected = useAPIRouteData(
    APIRoutesPaths.EspaceAgentLiensCapitalistiquesProtected,
    uniteLegale.siren,
    session
  );

  return (
    <AsyncDataSectionClient
      title="Liens capitalistiques"
      id="liens-capitalistiques"
      sources={[EAdministration.DGFIP]}
      isProtected
      data={liensCapitalistiquesProtected}
      notFoundInfo="Les liens capitalistiques n’ont pas été trouvés pour cette structure."
    >
      {(liens: ILiensCapitalistiquesProtected) => (
        <LiensCapitalistiquesContent liens={liens} />
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
