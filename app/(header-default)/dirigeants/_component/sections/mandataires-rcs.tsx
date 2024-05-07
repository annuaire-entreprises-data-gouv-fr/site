'use client';

import React from 'react';
import routes from '#clients/routes';
import { Warning } from '#components-ui/alerts';
import FadeIn from '#components-ui/animation/fade-in';
import { Section } from '#components/section';
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
 * Dirigeants section
 */
const MandatairesRCSSection: React.FC<IProps> = ({
  mandatairesRCS,
  immatriculationRNE,
  uniteLegale,
}) => (
  <Section
    id="rne-dirigeants"
    title="Dirigeant(s)"
    isProtected
    sources={[EAdministration.DINUM]}
  >
    <>
      {mandatairesRCS.length === 0 ? (
        <p>
          Cette entreprise est enregistrée sur{' '}
          <strong>Infogreffe (ex-RCS)</strong>, mais n’y possède aucun
          dirigeant.
        </p>
      ) : (
        <>
          <p>
            Cette entreprise possède {mandatairesRCS.length} mandataire(s)
            enregistrés sur <strong>Infogreffe (ex-RCS)</strong>. En tant
            qu’agent public, vous avez accès à la date de naissance exacte des
            dirigeants.
          </p>
          <DirigeantContent
            dirigeants={mandatairesRCS}
            isFallback={false}
            uniteLegale={uniteLegale}
          />
        </>
      )}
      {RCSDiffersFromRNE(mandatairesRCS, immatriculationRNE) && (
        <FadeIn>
          <Warning>
            <p>
              Le nombre de dirigeants enregistrés sur Infogreffe diffère de
              celui du RNE. Cette situation est anormale, et relève d’un
              dysfonctionnement du RNE ou d’Infogreffe.
            </p>
            <ul>
              <li>
                <a
                  rel="noopener"
                  target="_blank"
                  href={`${routes.rne.portail.entreprise}${uniteLegale.siren}`}
                  aria-label="Consulter la liste des dirigeants sur le site de l’INPI, nouvelle fenêtre"
                >
                  Consulter la liste des dirigeants sur le site de l’INPI
                </a>
              </li>
              <li>
                <a
                  rel="noopener"
                  target="_blank"
                  href={`${routes.infogreffe.portail.entreprise}${uniteLegale.siren}`}
                  aria-label="Consulter la liste des dirigeants sur le site d’Infogreffe, nouvelle fenêtre"
                >
                  Consulter la liste des dirigeants sur le site d’Infogreffe
                </a>
              </li>
            </ul>
          </Warning>
        </FadeIn>
      )}
    </>
  </Section>
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
