import React from 'react';
import ButtonLink from '#components-ui/button';
import { Section } from '#components/section';
import { administrationsMetaData } from '#models/administrations';
import { IAPINotRespondingError } from '#models/api-not-responding';

interface IProps extends IAPINotRespondingError {
  title?: string;
}

const AdministrationNotResponding: React.FC<IProps> = ({
  title,
  administration,
}) => {
  const administrationMetaData = administrationsMetaData[administration] || {};
  return (
    <Section
      title={`${
        title || administrationMetaData.long
      } : transmission des données hors-service 🛑`}
      sources={[administration]}
    >
      <p>
        Le service de l’administration qui nous transmet cette donnée ne
        fonctionne pas en ce moment.
        <br />
        <br />
        Cela vient probablement d’une surcharge ponctuelle de leurs services.
        Merci de ré-essayer plus tard. Nous sommes désolés pour le dérangement.
        <br />
        Pour en savoir plus sur l’état du service, consultez la section de cette
        administration{' '}
        <a
          href={`/donnees/api#${administrationMetaData.slug}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          dans la page statut des API
        </a>
        .
      </p>
      {administrationMetaData.site && (
        <div className="layout-center">
          <ButtonLink to={administrationMetaData.site}>
            Consulter le site de l’administration
          </ButtonLink>
        </div>
      )}
    </Section>
  );
};
export default AdministrationNotResponding;
