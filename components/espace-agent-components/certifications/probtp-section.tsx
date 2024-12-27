'use client';

import ButtonLink from '#components-ui/button';
import { DataSectionClient } from '#components/section/data-section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

export const ProbtpSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const probtp = useAPIRouteData(
    APIRoutesPaths.EspaceAgentProbtp,
    uniteLegale.siege.siret,
    session
  );
  return (
    <DataSectionClient
      title="Certificat PROBTP"
      id="probtp"
      isProtected
      sources={[EAdministration.PROBTP]}
      notFoundInfo={
        <>
          Cette entreprise n’a pas de{' '}
          <a
            target="_blank"
            rel="noreferrer"
            aria-label="En savoir plus sur les certificats PROBTP, nouvelle fenêtre"
            href="https://www.probtp.com/pro/entreprise-accueil.html"
          >
            certificat PROBTP
          </a>
          .
        </>
      }
      data={probtp}
    >
      {(probtp) => (
        <>
          <p>
            Cette entreprise possède un{' '}
            <a
              target="_blank"
              rel="noreferrer"
              aria-label="En savoir plus sur les certificats PROBTP, nouvelle fenêtre"
              href="https://www.probtp.com/pro/entreprise-accueil.html"
            >
              certificat PROBTP
            </a>{' '}
            valide.
          </p>
          <TwoColumnTable
            body={[
              [
                'Certificat',
                <ButtonLink
                  target="_blank"
                  alt
                  small
                  to={probtp.documentUrl}
                  ariaLabel="Télécharger le PDF, nouvelle fenêtre"
                >
                  Télécharger le PDF
                </ButtonLink>,
              ],
            ]}
          />
        </>
      )}
    </DataSectionClient>
  );
};
