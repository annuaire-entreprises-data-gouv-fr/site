import ButtonLink from '#components-ui/button';
import { AsyncDataSectionServer } from '#components/section/data-section/server';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IQualibat } from '#models/espace-agent/certificats/qualibat';
import { formatDateLong } from '#utils/helpers';

export const QualibatSection: React.FC<{
  qualibat: Promise<IQualibat | IAPINotRespondingError>;
}> = ({ qualibat }) => {
  return (
    <AsyncDataSectionServer
      title="Certificat Qualibat"
      id="qualibat"
      isProtected
      sources={[EAdministration.DINUM]}
      notFoundInfo={null}
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
    </AsyncDataSectionServer>
  );
};
