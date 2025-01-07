'use client';

import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

const generateCertificateRow = ({
  certificateName,
  certificateUrl,
  documentUrl,
}: {
  certificateName: string;
  certificateUrl: string;
  documentUrl: string | undefined;
}) => {
  return [
    certificateName,
    <>
      Cette entreprise {documentUrl ? 'possède un' : 'n‘a pas de'}{' '}
      <a
        target="_blank"
        rel="noreferrer"
        aria-label={`En savoir plus sur les certificats ${certificateName}, nouvelle fenêtre`}
        href={certificateUrl}
      >
        certificat {certificateName}
      </a>{' '}
      valide.
    </>,
    documentUrl && (
      <ButtonLink
        target="_blank"
        alt
        small
        to={documentUrl}
        ariaLabel="Télécharger le PDF, nouvelle fenêtre"
      >
        Télécharger le PDF
      </ButtonLink>
    ),
  ];
};

export default function TravauxPublicsSection({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  const travauxPublics = useAPIRouteData(
    APIRoutesPaths.EspaceAgentTravauxPublics,
    uniteLegale.siege.siret,
    session
  );

  return (
    <AsyncDataSectionClient
      title="Travaux publics"
      id="travaux-publics"
      isProtected
      sources={[
        EAdministration.FNTP,
        EAdministration.CIBTP,
        EAdministration.CNETP,
        EAdministration.PROBTP,
      ]}
      data={travauxPublics}
    >
      {(data) => (
        <>
          <p>
            Cette entreprise{' '}
            {data.fntp?.documentUrl ? 'possède une' : 'n‘a pas de'}{' '}
            <a
              href="https://www.fntp.fr/carte-professionnelle-tp-et-ip-de-quoi-parle-t-on/"
              aria-label="En savoir plus sur la carte professionnelle d’entrepreneur de travaux publics, nouvelle fenêtre"
              target="_blank"
              rel="noreferrer"
            >
              carte professionnelle d’entrepreneur de travaux publics
            </a>
            , délivrée par la FNTP.
          </p>

          {data.fntp?.documentUrl && (
            <div className="layout-center" style={{ marginBottom: 30 }}>
              <ButtonLink
                target="_blank"
                ariaLabel="Télécharger le justificatif de la carte professionnelle travaux publics, téléchargement dans une nouvelle fenêtre"
                to={`${data.fntp?.documentUrl}`}
              >
                <Icon slug="download">Télécharger le justificatif</Icon>
              </ButtonLink>
            </div>
          )}
          <FullTable
            head={['Type de certificat', 'Détails', 'Document']}
            verticalAlign="top"
            body={[
              {
                certificateName: 'CIBTP',
                certificateUrl: 'https://www.cibtp.fr/',
                documentUrl: data.cibtp?.documentUrl,
              },
              {
                certificateName: 'CNETP',
                certificateUrl: 'https://www.cnetp.org/',
                documentUrl: data.cnetp?.documentUrl,
              },
              {
                certificateName: 'PROBTP',
                certificateUrl:
                  'https://www.probtp.com/pro/entreprise-accueil.html',
                documentUrl: data.probtp?.documentUrl,
              },
            ].map(generateCertificateRow)}
          />
        </>
      )}
    </AsyncDataSectionClient>
  );
}
