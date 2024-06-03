'use client';

import ButtonLink from '#components-ui/button';
import { DataSectionClient } from '#components/section/data-section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { formatDateLong } from '#utils/helpers';
import { useFetchQualibat } from 'hooks/fetch/espace-agent/qualibat';

export const QualibatSection: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => {
  const qualibat = useFetchQualibat(uniteLegale);
  return (
    <DataSectionClient
      title="Certificat Qualibat"
      id="qualibat"
      isProtected
      sources={[EAdministration.DINUM]}
      notFoundInfo={
        <>
          Cette entreprise n’a pas de{' '}
          <a
            target="_blank"
            rel="noreferrer"
            aria-label="En savoir plus sur les certificats Qualibat, nouvelle fenêtre"
            href="https://www.qualibat.com/qualification-des-competences/"
          >
            certificat Qualibat
          </a>
          .
        </>
      }
      data={qualibat}
    >
      {(qualibat) => (
        <>
          <p>
            Cette entreprise possède un{' '}
            <a
              target="_blank"
              rel="noreferrer"
              aria-label="En savoir plus sur les certificats Qualibat, nouvelle fenêtre"
              href="https://www.qualibat.com/qualification-des-competences/"
            >
              certificat Qualibat
            </a>{' '}
            valide.
          </p>
          <TwoColumnTable
            body={[
              ...(qualibat.dateEmission && qualibat.dateFinValidite
                ? [
                    [
                      'Validité',
                      `Du ${formatDateLong(
                        qualibat.dateEmission
                      )} au ${formatDateLong(qualibat.dateFinValidite)}`,
                    ],
                  ]
                : []),
              ...(qualibat.informationsAdditionnelles
                ? [
                    [
                      'Qualification',
                      qualibat.informationsAdditionnelles.certifications
                        .map((c) => c.libelle)
                        .join(', '),
                    ],
                    [
                      'Assurance responsabilité civile',
                      `${qualibat.informationsAdditionnelles.assuranceResponsabiliteCivile.nom} (n° ${qualibat.informationsAdditionnelles.assuranceResponsabiliteCivile.identifiant})`,
                    ],
                    [
                      'Assurance décennale',
                      `${qualibat.informationsAdditionnelles.assuranceResponsabiliteTravaux.nom} (n° ${qualibat.informationsAdditionnelles.assuranceResponsabiliteTravaux.identifiant})`,
                    ],
                  ]
                : []),
              [
                'Certificat',
                <ButtonLink
                  target="_blank"
                  alt
                  small
                  to={qualibat.documentUrl}
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
