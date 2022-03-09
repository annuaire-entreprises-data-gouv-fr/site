import React from 'react';
import { IUniteLegale } from '../../models';
import { EAdministration } from '../../models/administration';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '../../models/api-not-responding';
import { formatDate, formatIntFr } from '../../utils/helpers/formatting';
import AdministrationNotResponding from '../administration-not-responding';
import BreakPageForPrint from '../print-break-page';
import ButtonLink from '../button';
import { download } from '../icon';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import { PrintNever } from '../print-visibility';
import { IImmatriculationJOAFE } from '../../models/justificatifs';

interface IProps {
  immatriculation: IImmatriculationJOAFE | IAPINotRespondingError;
  uniteLegale: IUniteLegale;
}

const ImmatriculationJOAFE: React.FC<IProps> = ({ immatriculation }) => {
  if (isAPINotResponding(immatriculation)) {
    if (immatriculation.errorType === 404) {
      return null;
    }
    return (
      <AdministrationNotResponding
        {...immatriculation}
        title="Enregistrement au JOAFE"
      />
    );
  }

  const data = [
    ['Siren', formatIntFr(immatriculation.siren)],
    ['N°RNA', formatIntFr(immatriculation.idRna)],
    ['Date d’enregistrement', formatDate(immatriculation.datePublication)],
  ];

  return (
    <>
      {immatriculation.downloadlink && (
        <>
          <Section
            id="joafe"
            title="Enregistrement au JOAFE"
            source={EAdministration.DILA}
          >
            <p>
              Cette entité est enregistrée au{' '}
              <b>Journal Officiel des Association (JOAFE)</b>.
            </p>
            <TwoColumnTable body={data} />
            <PrintNever>
              <p>
                Pour accéder à l’annonce de création de l’association,
                téléchargez le document ci-dessous :
              </p>
              <div className="layout-center">
                <ButtonLink
                  target="_blank"
                  to={`${immatriculation.downloadlink}?format=pdf`}
                >
                  {download} Télécharger le justificatif
                </ButtonLink>
              </div>
            </PrintNever>
          </Section>
          <BreakPageForPrint />
        </>
      )}
    </>
  );
};

export default ImmatriculationJOAFE;
