import React from 'react';
import routes from '#clients/routes';
import AdministrationNotResponding from '#components/administration-not-responding';
import { EDUCNAT } from '#components/administrations';
import ResultsPagination from '#components/search-results/results-pagination';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { Tag } from '#components-ui/tag';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IEtablissementsScolaires } from '#models/etablissements-scolaires';

export const EtablissementsScolairesSection: React.FC<{
  etablissements: IEtablissementsScolaires | IAPINotRespondingError;
}> = ({ etablissements }) => {
  const sectionTitle = 'Annuaire de l’Education Nationale';

  if (isAPINotResponding(etablissements)) {
    const isNotFound = etablissements.errorType === 404;

    if (isNotFound) {
      return (
        <Section
          title={sectionTitle}
          sources={[EAdministration.EDUCATION_NATIONALE]}
        >
          <p>
            Nous n’avons pas retrouvé les établissements scolaires de cette
            entité dans l’annuaire de l’
            <EDUCNAT />. En revanche, vous pouvez peut-être les retrouver grâce
            au{' '}
            <a href={routes.educationNationale.site}>
              moteur de recherche de l’
              <EDUCNAT />
            </a>
            .
          </p>
        </Section>
      );
    }

    return (
      <AdministrationNotResponding
        administration={etablissements.administration}
        errorType={etablissements.errorType}
        title={sectionTitle}
      />
    );
  }

  const plural = etablissements.results.length > 1 ? 's' : '';

  return (
    <Section
      title={sectionTitle}
      sources={[EAdministration.EDUCATION_NATIONALE]}
    >
      <p>
        Cette structure possède <b>{etablissements.resultCount}</b>{' '}
        établissement
        {plural} scolaire{plural}&nbsp;:
      </p>
      <FullTable
        head={['N° UAI', 'Académie', 'Détails', 'Contact', 'Nb d’élèves']}
        body={etablissements.results.map(
          ({
            adresse,
            codePostal,
            libelleAcademie,
            mail,
            nombreEleves,
            nomCommune,
            nomEtablissement,
            telephone,
            uai,
            zone,
          }) => [
            <Tag>{uai}</Tag>,
            `${libelleAcademie} ${zone ? `- zone ${zone}` : null}`,
            <>
              {nomEtablissement}
              <br />
              {adresse}, {codePostal}, {nomCommune}
            </>,
            <>
              <a href={`mailto:${mail}`}>{mail}</a>
              <br />
              <a href={`tel:${telephone}`}>{telephone}</a>
            </>,
            nombreEleves,
          ]
        )}
      />
      {etablissements.pageCount > 1 && (
        <ResultsPagination
          totalPages={etablissements.pageCount}
          currentPage={etablissements.currentPage}
          compact={true}
        />
      )}
    </Section>
  );
};
