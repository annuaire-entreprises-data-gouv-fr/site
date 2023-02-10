import React from 'react';
import InpiPartiallyDownWarning from '#components-ui/alerts/inpi-partially-down';
import { OpenClosedTag } from '#components-ui/badge/frequent';
import ButtonLink from '#components-ui/button';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { Icon } from '#components-ui/icon/wrapper';
import BreakPageForPrint from '#components-ui/print-break-page';
import { PrintNever } from '#components-ui/print-visibility';
import { INPI } from '#components/administrations';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IImmatriculationRNE } from '#models/immatriculation/rne';
import { IUniteLegale } from '#models/index';
import { formatDate, formatIntFr } from '#utils/helpers';
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
      {immatriculation.downloadLink && (
        <>
          <Section
            id="rne"
            title="Justificatif d’immatriculation au RNE"
            sources={[EAdministration.INPI]}
          >
            <p>
              Cette structure est enregistrée au{' '}
              <b>Registre National des Entreprises (RNE)</b>.
            </p>
            <PrintNever>
              <>
                <p>
                  Pour obtenir un <b>justificatif d’immatriculation</b>{' '}
                  (équivalent de l’extrait KBIS ou D1 pour les entreprises
                  artisanales),{' '}
                  <b>téléchargez l’extrait d’immatriculation au RNE</b> ou
                  consultez la fiche complète sur le site de l’
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
