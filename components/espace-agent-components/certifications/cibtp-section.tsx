'use client';

import ButtonLink from '#components-ui/button';
import { DataSectionClient } from '#components/section/data-section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

export const CibtpSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const cibtp = useAPIRouteData(
    APIRoutesPaths.EspaceAgentCibtp,
    uniteLegale.siege.siret,
    session
  );
  return (
    <DataSectionClient
      title="Certificat CIBTP"
      id="cibtp"
      isProtected
      sources={[EAdministration.CIBTP]}
      notFoundInfo={
        <>
          Cette entreprise n’a pas de{' '}
          <a
            target="_blank"
            rel="noreferrer"
            aria-label="En savoir plus sur les certificats CIBTP, nouvelle fenêtre"
            href="https://www.cibtp.fr/"
          >
            certificat CIBTP
          </a>
          .
        </>
      }
      data={cibtp}
    >
      {(cibtp) => (
        <>
          <p>
            Cette entreprise possède un{' '}
            <a
              target="_blank"
              rel="noreferrer"
              aria-label="En savoir plus sur les certificats CIBTP, nouvelle fenêtre"
              href="https://www.cibtp.fr/"
            >
              certificat CIBTP
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
                  to={cibtp.documentUrl}
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
