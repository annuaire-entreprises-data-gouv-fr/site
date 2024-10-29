'use client';

import ButtonLink from '#components-ui/button';
import { DataSectionClient } from '#components/section/data-section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

export const CnetpSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const cnetp = useAPIRouteData(
    APIRoutesPaths.EspaceAgentCnetp,
    uniteLegale.siren,
    session
  );
  return (
    <DataSectionClient
      title="Certificat CNETP"
      id="cnetp"
      isProtected
      sources={[EAdministration.CNETP]}
      notFoundInfo={
        <>
          Cette entreprise n’a pas de{' '}
          <a
            target="_blank"
            rel="noreferrer"
            aria-label="En savoir plus sur les certificats CNETP, nouvelle fenêtre"
            href="https://www.cnetp.org/"
          >
            certificat CNETP
          </a>
          .
        </>
      }
      data={cnetp}
    >
      {(cnetp) => (
        <>
          <p>
            Cette entreprise possède un{' '}
            <a
              target="_blank"
              rel="noreferrer"
              aria-label="En savoir plus sur les certificats CNETP, nouvelle fenêtre"
              href="https://www.cnetp.org/"
            >
              certificat CNETP
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
                  to={cnetp.documentUrl}
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
