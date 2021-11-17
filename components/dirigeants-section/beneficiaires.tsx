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
import { IBeneficiaire } from '../../models/dirigeants';

interface IProps {
  beneficiaires: IBeneficiaire[] | IAPINotRespondingError;
  siren: Siren;
}

/**
 * Dirigeants section
 * @param param0
 * @returns
 */
const BeneficiairesSection: React.FC<IProps> = ({ beneficiaires, siren }) => {
  if (isAPINotResponding(beneficiaires)) {
    if (beneficiaires.errorType === 404) {
      return null;
    }
    return (
      <AdministrationNotResponding
        administration={beneficiaires.administration}
        errorType={beneficiaires.errorType}
        title="Bénéficiaires Effectifs"
      />
    );
  }

  const formtInfos = (beneficiaire: IBeneficiaire) => [
    ['Nom', beneficiaire.nom],
    ['Prénoms', beneficiaire.prenoms],
    ['Date de naissance', beneficiaire.dateNaissance],
    ['Nationalité', beneficiaire.nationalite],
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
