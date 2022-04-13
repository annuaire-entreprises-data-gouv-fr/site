import React from 'react';
import HorizontalSeparator from '../horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import { EAdministration } from '../../models/administration';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '../../models/api-not-responding';
import AdministrationNotResponding from '../administration-not-responding';
import routes from '../../clients/routes';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { INPI } from '../administrations';
import { formatDate } from '../../utils/helpers/formatting';
import {
  IBeneficiaire,
  IImmatriculationRNCS,
} from '../../models/immatriculation/rncs';
import InpiPartiallyDownWarning from '../alerts/inpi-partially-down';

interface IProps {
  immatriculationRNCS: IImmatriculationRNCS | IAPINotRespondingError;
  siren: Siren;
}

/**
 * Dirigeants section
 * @param param0
 * @returns
 */
const BeneficiairesSection: React.FC<IProps> = ({
  immatriculationRNCS,
  siren,
}) => {
  if (isAPINotResponding(immatriculationRNCS)) {
    if (immatriculationRNCS.errorType === 404) {
      return null;
    }
    return (
      <AdministrationNotResponding
        administration={immatriculationRNCS.administration}
        errorType={immatriculationRNCS.errorType}
        title="Bénéficiaires Effectifs"
      />
    );
  }

  const { beneficiaires } = immatriculationRNCS;

  const formtInfos = (beneficiaire: IBeneficiaire) => [
    ['Nom', beneficiaire.nom],
    ['Prénoms', beneficiaire.prenoms],
    ['Date de naissance', beneficiaire.dateNaissance],
    ['Nationalité', beneficiaire.nationalite],
    ['Date de déclaration', formatDate(beneficiaire.dateGreffe)],
  ];

  const plural = beneficiaires.length > 1 ? 's' : '';

  return (
    <>
      <HorizontalSeparator />
      <Section
        id="beneficiaires"
        title={`Les informations sur le${plural} bénéficiaire${plural} effectif${plural}`}
        source={EAdministration.INPI}
      >
        <>
          {immatriculationRNCS.metadata.isFallback &&
            immatriculationRNCS.beneficiaires.length > 0 && (
              <InpiPartiallyDownWarning missing="la date de déclaration, et la différence entre le nom et le prénom" />
            )}
          <p>
            Cette entité possède {beneficiaires.length} bénéficiaire{plural}{' '}
            effectif{plural} enregistré{plural} au{' '}
            <b>Registre National du Commerce et des Sociétés (RNCS)</b>{' '}
            centralisé par l’
            <INPI />. Pour en savoir plus, vous pouvez consulter{' '}
            <a
              rel="noreferrer noopener nofollow"
              target="_blank"
              href={`${routes.rncs.portail.entreprise}${siren}`}
            >
              la page de cette entreprise
            </a>{' '}
            sur le site de l’INPI&nbsp;:
          </p>
          {beneficiaires.map((beneficiaire, idx) => (
            <React.Fragment key={'b' + idx}>
              <TwoColumnTable body={formtInfos(beneficiaire)} />
              {beneficiaires.length !== idx + 1 && <br />}
            </React.Fragment>
          ))}
        </>
      </Section>
      <style global jsx>{`
        table > tbody > tr > td:first-of-type {
          width: 30%;
        }
      `}</style>
    </>
  );
};
export default BeneficiairesSection;
