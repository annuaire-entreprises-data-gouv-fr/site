import React from 'react';
import { IAssociation } from '../../models';
import { EAdministration } from '../../models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '../../models/api-not-responding';
import { formatDate, formatIntFr } from '../../utils/helpers/formatting';
import AdministrationNotResponding from '../administration-not-responding';
import BreakPageForPrint from '../../components-ui/print-break-page';
import ButtonLink from '../../components-ui/button';
import { download } from '../../components-ui/icon';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import { PrintNever } from '../../components-ui/print-visibility';
import { IImmatriculationJOAFE } from '../../models/immatriculation/joafe';

interface IProps {
  immatriculation: IImmatriculationJOAFE | IAPINotRespondingError;
  uniteLegale: IAssociation;
}

const ImmatriculationJOAFE: React.FC<IProps> = ({
  immatriculation,
  uniteLegale,
}) => {
  if (isAPINotResponding(immatriculation)) {
    if (immatriculation.errorType === 404) {
      return null;
    } else {
      return (
        <AdministrationNotResponding
          {...immatriculation}
          title="Enregistrement au JOAFE"
        />
      );
    }
  }

  const data = [
    ['Siren', formatIntFr(immatriculation.siren)],
    ['N°RNA', formatIntFr(immatriculation.idRna)],
    ['Date d’enregistrement', formatDate(immatriculation.datePublication)],
  ];

  return (
    <>
      {immatriculation.downloadLink && (
        <>
          <Section
            id="joafe"
            title="Enregistrement au JOAFE"
            sources={[EAdministration.DILA]}
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
                  to={`${immatriculation.downloadLink}`}
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
