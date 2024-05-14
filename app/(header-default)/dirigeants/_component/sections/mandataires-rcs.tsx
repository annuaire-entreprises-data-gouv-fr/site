'use client';

import React from 'react';
import routes from '#clients/routes';
import { Warning } from '#components-ui/alerts';
import FadeIn from '#components-ui/animation/fade-in';
import { DataSectionServer } from '#components/section/data-section/server';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPILoading, isAPILoading } from '#models/api-loading';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { IDirigeant, IImmatriculationRNE } from '#models/immatriculation';
import { DirigeantContent } from './dirigeant-content';

type IProps = {
  mandatairesRCS: Array<IDirigeant>;
  immatriculationRNE:
    | IImmatriculationRNE
    | IAPINotRespondingError
    | IAPILoading;
  uniteLegale: IUniteLegale;
};

/**
 * Dirigeants from RCS section
 */
const MandatairesRCSSection: React.FC<IProps> = ({
  mandatairesRCS,
  immatriculationRNE,
  uniteLegale,
}) => (
  <DataSectionServer
    id="rne-dirigeants"
    title="Dirigeant(s)"
    isProtected
    sources={[EAdministration.INFOGREFFE]}
    data={mandatairesRCS}
  >
    {(mandatairesRCS) =>
      mandatairesRCS.length === 0 ? (
        <p>Cette entreprise ne possède aucun dirigeant.</p>
      ) : (
        <>
          {RCSDiffersFromRNE(mandatairesRCS, immatriculationRNE) && (
            <FadeIn>
              <Warning>
                Le nombre de dirigeants enregistrés sur Infogreffe (ex-RCS)
                diffère de celui du RNE. Cette situation est anormale. Pour en
                savoir plus vous pouvez consulter la page de cette entreprise
                sur{' '}
                <a
                  rel="noopener"
                  target="_blank"
                  href={`${routes.rne.portail.entreprise}${uniteLegale.siren}`}
                  aria-label="Consulter la liste des dirigeants sur le site de l’INPI, nouvelle fenêtre"
                >
                  data.inpi.fr
                </a>{' '}
                ou sur{' '}
                <a
                  rel="noopener"
                  target="_blank"
                  href={`${routes.infogreffe.portail.entreprise}${uniteLegale.siren}`}
                  aria-label="Consulter la liste des dirigeants sur le site d’Infogreffe, nouvelle fenêtre"
                >
                  Infogreffe
                </a>
                .
              </Warning>
            </FadeIn>
          )}
          <p>
            Cette entreprise possède {mandatairesRCS.length} mandataire(s)
            enregistrés sur <strong>Infogreffe</strong> (ex-RCS). Nous vous
            affichons cette liste en complément du RNE car elle permet d’accèder
            à la date de naissance complète des personnes physiques :
          </p>
          <DirigeantContent
            dirigeants={mandatairesRCS}
            isFallback={false}
            uniteLegale={uniteLegale}
          />
        </>
      )
    }
  </DataSectionServer>
);

export default MandatairesRCSSection;

function RCSDiffersFromRNE(
  mandatairesRCS: Array<IDirigeant>,
  immatriculationRNE: IImmatriculationRNE | IAPINotRespondingError | IAPILoading
) {
  if (
    isAPILoading(immatriculationRNE) ||
    isAPINotResponding(immatriculationRNE)
  ) {
    return null;
  }
  return mandatairesRCS.length !== immatriculationRNE.dirigeants.length;
}
