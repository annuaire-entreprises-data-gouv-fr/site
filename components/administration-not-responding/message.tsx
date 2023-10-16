import React from 'react';
import Warning from '#components-ui/alerts/warning';
import { IAdministrationMetaData } from '#models/administrations/types';

interface IProps {
  administrationMetaData: IAdministrationMetaData;
}

const AdministrationNotRespondingMessage: React.FC<IProps> = ({
  administrationMetaData,
}) => {
  return (
    <>
      <Warning>
        Le service de l’administration qui nous transmet cette donnée ne
        fonctionne pas en ce moment. 🛑
      </Warning>
      <p>
        Cela vient probablement d’une surcharge ponctuelle de leurs services.
        Merci de ré-essayer plus tard. Nous sommes désolés pour le dérangement.
      </p>
      <p>
        Pour en savoir plus sur l’état du service, vous pouvez consultez la
        section de cette administration{' '}
        <a
          href={`/donnees/api#${administrationMetaData.slug}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          dans la page statut des API
        </a>
        {administrationMetaData.site && (
          <>
            {' '}
            ou{' '}
            <a href={administrationMetaData.site}>
              le site de l’administration
            </a>
          </>
        )}
        .
      </p>
    </>
  );
};
export default AdministrationNotRespondingMessage;