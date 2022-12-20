import React from 'react';
import { Tag } from '#components-ui/tag';
import AdministrationNotResponding from '#components/administration-not-responding';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IEducationNationaleEtablissement } from '#models/education-nationale';

export const EducationNationaleEtablisssmentsSection: React.FC<{
  etablissements: IEducationNationaleEtablissement[] | IAPINotRespondingError;
}> = ({ etablissements }) => {
  const sectionTitle = 'Éducation nationale';

  if (isAPINotResponding(etablissements)) {
    return (
      <AdministrationNotResponding
        administration={etablissements.administration}
        errorType={etablissements.errorType}
        title={sectionTitle}
      />
    );
  }

  const plural = etablissements.length > 1 ? 's' : '';

  return (
    <Section
      title={sectionTitle}
      sources={[EAdministration.EDUCATION_NATIONALE]}
    >
      <p>
        Cette structure possède <b>{etablissements.length}</b> établissements
        scolaire{plural}&nbsp;:
      </p>
      <FullTable
        head={['Nom', 'Académie', "Nombre d'élèves", 'Coordonnées']}
        body={etablissements.map((etablissement) => [
          <div className="font-small">
            <div>{etablissement.nomEtablissement}</div>
          </div>,
          <div className="font-small">
            <div>
              {etablissement.libelleAcademie}{' '}
              {etablissement.zone ? `- zone ${etablissement.zone}` : null}
            </div>
          </div>,
          <div className="font-small">
            <div>{etablissement.nombreEleves}</div>
          </div>,
          <div>
            <div className="font-small">
              {etablissement.adresse}, {etablissement.codePostal},{' '}
              {etablissement.nomCommune}
            </div>
            <div className="font-small">{etablissement.mail}</div>
            <div className="font-small">
              <a href={`tel:${etablissement.telephone}`}>
                {etablissement.telephone}
              </a>
            </div>
          </div>,
        ])}
      />
    </Section>
  );
};
