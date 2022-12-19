import { Tag } from '#components-ui/tag';
import AdministrationNotResponding from '#components/administration-not-responding';
import { MC } from '#components/administrations';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IEntrepreneurSpectaclesCertification } from '#models/certifications/entrepreneur-spectacles';
import { formatDateLong } from '#utils/helpers';
import React from 'react';

export const CertificationsEntrepreneurSpectaclesSection: React.FC<{
  entrepreneurSpectacles:
    | IEntrepreneurSpectaclesCertification
    | IAPINotRespondingError;
}> = ({ entrepreneurSpectacles }) => {
  const sectionTitle = "RGE - Reconnu Garant de l'Environnement";

  if (isAPINotResponding(entrepreneurSpectacles)) {
    const isNotFound = entrepreneurSpectacles.errorType === 404;

    if (isNotFound) {
      return (
        <Section title={sectionTitle} sources={[EAdministration.MC]}>
          <p>
            Nous n’avons pas retrouvé de récipissé de déclaration d’entrepreneur
            de spectacles vivants déposé auprès du <MC /> pour cette structure.
          </p>
          <p>
            Pour effectuer une déclaration, rendez-vous sur{' '}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://www.culture.gouv.fr/Thematiques/Theatre-spectacles/Pour-les-professionnels/Plateforme-des-entrepreneurs-de-spectacles-vivants-PLATESV#deux"
            >
              la plateforme PLATES
            </a>
          </p>
        </Section>
      );
    }
    return (
      <AdministrationNotResponding
        administration={entrepreneurSpectacles.administration}
        errorType={entrepreneurSpectacles.errorType}
        title={sectionTitle}
      />
    );
  }

  const plural = entrepreneurSpectacles.licences.length > 1 ? 's' : '';

  return (
    <Section
      title="Entrepreneur de spectacles vivants"
      sources={[EAdministration.DINUM, EAdministration.MC]}
      lastModified={entrepreneurSpectacles.lastModified}
    >
      Cette structure possède {plural ? 'plusieurs' : 'un'} récépissé{plural} de
      déclaration d’activité d’entrepreneur de spectacles déposé{plural} sur{' '}
      <a
        target="_blank"
        rel="noreferrer noopener"
        href="https://www.culture.gouv.fr/Thematiques/Theatre-spectacles/Pour-les-professionnels/Plateforme-des-entrepreneurs-de-spectacles-vivants-PLATESV#deux"
      >
        la plateforme PLATES
      </a>{' '}
      du <MC />.
      <FullTable
        head={[
          'Numéro de récipissé',
          'Date de déclaration',
          'Type',
          'Validité',
        ]}
        body={entrepreneurSpectacles.licences.map((licence) => [
          <Tag>{licence.numeroRecepisse}</Tag>,
          formatDateLong(licence.dateDepot),
          licence.type,
          licence.statut === 'Invalide' ? (
            <Tag className="closed">invalide</Tag>
          ) : licence.dateValidite ? (
            <Tag className="open">valide jusqu’au {licence.dateValidite}</Tag>
          ) : (
            ''
          ),
        ])}
      />
    </Section>
  );
};
