import React from 'react';
import ButtonLink from '#components-ui/button';
import { download } from '#components-ui/icon';
import BreakPageForPrint from '#components-ui/print-break-page';
import { PrintNever } from '#components-ui/print-visibility';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IImmatriculationJOAFE } from '#models/immatriculation/joafe';
import { IUniteLegale } from '#models/index';
import { formatDate, formatIntFr } from '#utils/helpers';
import AdministrationNotResponding from '../administration-not-responding';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';

interface IProps {
  immatriculation: IImmatriculationJOAFE | IAPINotRespondingError;
  uniteLegale: IUniteLegale;
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
              Cette structure est enregistrée au{' '}
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
