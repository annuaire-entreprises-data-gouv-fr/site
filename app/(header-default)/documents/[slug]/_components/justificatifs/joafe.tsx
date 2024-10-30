'use client';

import AssociationCreationNotFoundAlert from '#components-ui/alerts-with-explanations/association-creation-not-found-alert';
import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import { PrintNever } from '#components-ui/print-visibility';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAssociation } from '#models/core/types';
import { formatDate, formatIntFr } from '#utils/helpers';
import { useFetchJOAFE } from 'hooks';
import React from 'react';
import { TwoColumnTable } from '../../../../../../components/table/simple';

type IProps = {
  uniteLegale: IAssociation;
};

export const JustificatifImmatriculationJOAFE: React.FC<IProps> = ({
  uniteLegale,
}) => {
  const annoncesJOAFE = useFetchJOAFE(uniteLegale);

  return (
    <AsyncDataSectionClient
      id="justificatifs"
      title="Enregistrement au JOAFE"
      sources={[EAdministration.DILA]}
      data={annoncesJOAFE}
      notFoundInfo={
        <AssociationCreationNotFoundAlert uniteLegale={uniteLegale} />
      }
    >
      {(annoncesJOAFE) => {
        const annonceCreation = annoncesJOAFE.annonces.find(
          (annonce) => annonce.typeAvisLibelle === 'Création'
        );

        if (typeof annonceCreation === 'undefined') {
          return <AssociationCreationNotFoundAlert uniteLegale={uniteLegale} />;
        } else {
          const downloadLink = annonceCreation.path + '?format=pdf';

          const data = [
            ['Siren', formatIntFr(uniteLegale.siren)],
            ['N°RNA', formatIntFr(uniteLegale.association.idAssociation)],
            [
              'Date d’enregistrement',
              formatDate(annonceCreation.datePublication),
            ],
          ];
          return (
            <>
              <p>
                Cette structure est enregistrée au{' '}
                <strong>Journal Officiel des Association (JOAFE)</strong>.
              </p>
              <TwoColumnTable body={data} />
              {downloadLink && (
                <PrintNever>
                  <p>
                    Pour accéder à l’annonce de création de l’association,
                    téléchargez le document ci-dessous :
                  </p>
                  <div className="layout-center">
                    <ButtonLink target="_blank" to={`${downloadLink}`}>
                      <Icon slug="download">Télécharger le justificatif</Icon>
                    </ButtonLink>
                  </div>
                </PrintNever>
              )}
            </>
          );
        }
      }}
    </AsyncDataSectionClient>
  );
};
