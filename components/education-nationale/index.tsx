import React from 'react';
import routes from '#clients/routes';
import AdministrationNotResponding from '#components/administration-not-responding';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IEducationNationaleEtablissement } from '#models/education-nationale';

export const EducationNationaleSection: React.FC<{
  etablissements: IEducationNationaleEtablissement[] | IAPINotRespondingError;
}> = ({ etablissements }) => {
  const sectionTitle = 'Éducation nationale';

  if (isAPINotResponding(etablissements)) {
    const isNotFound = etablissements.errorType === 404;

    if (isNotFound) {
      return (
        <Section
          title={sectionTitle}
          sources={[EAdministration.EDUCATION_NATIONALE]}
        >
          <p>
            Nous n’avons pas retrouvé les établissement scolaire de cette entité
            dans l’annuaire de l&apos;éducation nationale. En revanche, vous
            pouvez peut-être les retrouver grâce au{' '}
            <a href={routes.educationNationale.site}>
              moteur de recherche de l&apos;éducation nationale
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
        head={['UAI', 'Nom', 'Académie', "Nombre d'élèves", 'Coordonnées']}
        body={etablissements.map(
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
            <div className="font-small">
              <div>
                <b>{uai}</b>
              </div>
            </div>,
            <div className="font-small">
              <div>{nomEtablissement}</div>
            </div>,
            <div className="font-small">
              <div>
                {libelleAcademie} {zone ? `- zone ${zone}` : null}
              </div>
            </div>,
            <div className="font-small">
              <div>{nombreEleves}</div>
            </div>,
            <div>
              <div className="font-small">
                {adresse}, {codePostal}, {nomCommune}
              </div>
              <div className="font-small">{mail}</div>
              <div className="font-small">
                <a href={`tel:${telephone}`}>
                  {telephone.match(/.{1,2}/g)?.join(' ')}
                </a>
              </div>
            </div>,
          ]
        )}
      />
    </Section>
  );
};
