import React from 'react';
import ButtonLink from '#components-ui/button';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { Icon } from '#components-ui/icon/wrapper';
import BreakPageForPrint from '#components-ui/print-break-page';
import { PrintNever } from '#components-ui/print-visibility';
import { INPI } from '#components/administrations';
import { Section } from '#components/section';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IImmatriculationRNE } from '#models/immatriculation/rne';
import { IUniteLegale } from '#models/index';
import AdministrationNotResponding from '../administration-not-responding';

interface IProps {
  immatriculation: IImmatriculationRNE | IAPINotRespondingError;
  uniteLegale: IUniteLegale;
}

const ImmatriculationRNE: React.FC<IProps> = ({
  immatriculation,
  uniteLegale,
}) => {
  if (isAPINotResponding(immatriculation)) {
    if (immatriculation.errorType === 404) {
      return null;
    }
    return (
      <AdministrationNotResponding
        {...immatriculation}
        title="Justificatif d’Immatriculation au RNE"
      />
    );
  }

  return (
    <>
      {true && (
        <>
          <Section
            id="rne"
            title="Justificatif d’immatriculation au RNE"
            sources={[EAdministration.INPI]}
          >
            <PrintNever>
              <>
                <p>
                  Pour vérifier si cette structure est enregistrée au{' '}
                  <b>Registre National des Entreprises (RNE)</b> essayez de
                  télécharger son <b>justificatif d’immatriculation</b>{' '}
                  (équivalent de l’extrait KBIS ou D1 pour les entreprises
                  artisanales), ou de consultez sa fiche sur le site de l’
                  <INPI />
                  &nbsp;:
                </p>
                <div className="layout-center">
                  <ButtonLink
                    nofollow={true}
                    to={`/justificatif-immatriculation-pdf/${uniteLegale.siren}`}
                  >
                    <Icon slug="download">
                      Télécharger le justificatif d’immatriculation
                    </Icon>
                  </ButtonLink>
                  <div className="separator" />
                  <ButtonLink
                    nofollow={true}
                    target="_blank"
                    to={`${immatriculation.siteLink}`}
                    alt
                  >
                    ⇢ Voir la fiche sur le site de l’INPI
                  </ButtonLink>
                </div>
              </>
            </PrintNever>
            <style jsx>{`
              .separator {
                width: 10px;
                height: 10px;
              }
            `}</style>
          </Section>
          <HorizontalSeparator />
          <BreakPageForPrint />
        </>
      )}
    </>
  );
};

export default ImmatriculationRNE;
