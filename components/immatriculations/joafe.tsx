import React from 'react';
import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import BreakPageForPrint from '#components-ui/print-break-page';
import { PrintNever } from '#components-ui/print-visibility';
import { DataSection } from '#components/section/data-section';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IImmatriculationJOAFE } from '#models/immatriculation/joafe';
import { formatDate, formatIntFr } from '#utils/helpers';
import { TwoColumnTable } from '../table/simple';

type IProps = {
  immatriculation: IImmatriculationJOAFE | IAPINotRespondingError;
};

const ImmatriculationJOAFE: React.FC<IProps> = ({ immatriculation }) => (
  <>
    <DataSection
      id="joafe"
      title="Enregistrement au JOAFE"
      sources={[EAdministration.DILA]}
      data={immatriculation}
      notFoundInfo={null}
    >
      {(immatriculation) => {
        const data = [
          ['Siren', formatIntFr(immatriculation.siren)],
          ['N°RNA', formatIntFr(immatriculation.idRna)],
          [
            'Date d’enregistrement',
            formatDate(immatriculation.datePublication),
          ],
        ];
        return (
          <>
            <p>
              Cette structure est enregistrée au{' '}
              <b>Journal Officiel des Association (JOAFE)</b>.
            </p>
            <TwoColumnTable body={data} />
            {immatriculation.downloadLink && (
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
                    <Icon slug="download">Télécharger le justificatif</Icon>
                  </ButtonLink>
                </div>
              </PrintNever>
            )}
          </>
        );
      }}
    </DataSection>
    <BreakPageForPrint />
  </>
);

export default ImmatriculationJOAFE;
