import React from 'react';
import FAQLink from '#components-ui/faq-link';
import { Icon } from '#components-ui/icon/wrapper';
import InformationTooltip from '#components-ui/information-tooltip';
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

const formatLicence = (categorie: number, nomLieu = '') => {
  switch (categorie) {
    case 1:
      return (
        <>
          <b>Exploitant de lieu de spectacles vivant</b>
          {nomLieu && (
            <>
              <br />
              <Icon slug="mapPin">{nomLieu}</Icon>
            </>
          )}
        </>
      );
    case 2:
      return <b>Producteurs de spectacles ou entrepreneurs de tournées</b>;
    case 3:
      return <b>Diffuseurs de spectacles</b>;
    default:
      return <i>Non renseigné</i>;
  }
};

const Validity = ({ statut = '', dateDeValidite = '' }) => {
  switch (statut) {
    case 'valide':
      return (
        <InformationTooltip label="La déclaration vaut récépissé. L'exercice de la profession est licite.">
          <Tag color="success">valide</Tag>
          {dateDeValidite ? ` depuis le ${dateDeValidite}` : ''}
        </InformationTooltip>
      );
    case 'en instruction':
      return (
        <InformationTooltip label="Instruction du dossier en cours. L'exercice de la profession au titre de cette déclaration est interdit.">
          <Tag color="info">En instruction</Tag>
        </InformationTooltip>
      );
    case 'invalidé':
      return (
        <InformationTooltip label="Le récépissé a été retirée après une période de validité.">
          <Tag color="error">Invalidé</Tag>
          {dateDeValidite ? ` depuis le ${dateDeValidite}` : ''}
        </InformationTooltip>
      );
    case 'invalide':
      return (
        <InformationTooltip label="La déclaration a été refusée. L'exercice de la profession au titre de cette déclaration est interdit.">
          <Tag color="error">Invalide</Tag>
        </InformationTooltip>
      );
    default:
      return <Tag color="new">Etat inconnu</Tag>;
  }
};

export const CertificationsEntrepreneurSpectaclesSection: React.FC<{
  entrepreneurSpectacles:
    | IEntrepreneurSpectaclesCertification
    | IAPINotRespondingError;
}> = ({ entrepreneurSpectacles }) => {
  const sectionTitle = "RGE - Reconnu Garant de l'Environnement";
  const FAQ = () => (
    <FAQLink tooltipLabel="d’entrepreneur de spectacles vivants">
      Un entrepreneur de spectacles vivants désigne toute personne qui exerce
      une activité d’exploitation de lieux de spectacles, de production ou de
      diffusion de spectacles.
      <br />
      <br />
      <a href="/faq/entrepreneur-spectacles-vivants">→ En savoir plus</a>
    </FAQLink>
  );

  if (isAPINotResponding(entrepreneurSpectacles)) {
    const isNotFound = entrepreneurSpectacles.errorType === 404;

    if (isNotFound) {
      return (
        <Section title={sectionTitle} sources={[EAdministration.MC]}>
          <p>
            Nous n’avons pas retrouvé de récépissé de déclaration <FAQ /> déposé
            auprès du <MC /> pour cette structure.
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
      déclaration d’activité <FAQ /> déposé{plural} sur{' '}
      <a
        target="_blank"
        rel="noreferrer noopener"
        href="https://www.culture.gouv.fr/Thematiques/Theatre-spectacles/Pour-les-professionnels/Plateforme-des-entrepreneurs-de-spectacles-vivants-PLATESV#deux"
      >
        la plateforme PLATES
      </a>{' '}
      du <MC />.
      <p>
        Le <b>numéro de récépissé est le numéro de déclaration</b>. Le récépissé
        est valide 30 jours après que le dossier ait été reçu complet et
        conforme à la réglementation. Un récépissé de déclaration au statut
        valide est <b>valable pour cinq ans</b>.
      </p>
      <p>
        Si une déclaration que vous avez faite n’apparaît pas sur le tableau
        après plus d’un mois, veuillez contacter{' '}
        <a href="https://mesdemarches.culture.gouv.fr/loc_fr/mcc/?__CSRFTOKEN__=ade60dc8-891d-439e-b355-0438dea9a33c">
          le service des démarches en lignes
        </a>{' '}
        du <MC />.
      </p>
      <FullTable
        head={[
          'Numéro de récépissé',
          'Type de déclaration',
          'Date de déclaration',
          'Demande',
          'Validité',
        ]}
        body={entrepreneurSpectacles.licences.map(
          ({
            numeroRecepisse,
            categorie,
            nomLieu,
            type,
            dateDepot,
            dateValidite,
            statut,
          }) => [
            <Tag>{numeroRecepisse}</Tag>,
            formatLicence(categorie, nomLieu),
            formatDateLong(dateDepot),
            type,
            <Validity
              statut={(statut || '').toLowerCase()}
              dateDeValidite={dateValidite}
            />,
          ]
        )}
      />
    </Section>
  );
};
