import React from 'react';
import HorizontalSeparator from '../../components-ui/horizontal-separator';
import { Section } from '../section';
import { EAdministration } from '../../models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '../../models/api-not-responding';
import AdministrationNotResponding from '../administration-not-responding';
import routes from '../../clients/routes';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { INPI } from '../administrations';
import { formatDate, formatDatePartial } from '../../utils/helpers/formatting';
import {
  IBeneficiaire,
  IImmatriculationRNCS,
} from '../../models/immatriculation/rncs';
import InpiPartiallyDownWarning from '../../components-ui/alerts/inpi-partially-down';
import { FullTable } from '../table/full';

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
    formatDate(beneficiaire.dateGreffe),
    <>
      {beneficiaire.prenoms}
      {beneficiaire.prenoms && ' '}
      {(beneficiaire.nom || '').toUpperCase()}, né(e) en{' '}
      {formatDatePartial(beneficiaire.dateNaissancePartial)}
    </>,
    beneficiaire.nationalite,
  ];

  const plural = beneficiaires.length > 1 ? 's' : '';

  return (
    <>
      <HorizontalSeparator />
      <Section
        id="beneficiaires"
        title={`Bénéficiaire${plural} effectif${plural}`}
        sources={[EAdministration.INPI]}
      >
        {immatriculationRNCS.beneficiaires.length === 0 ? (
          <p>
            Cette structure ne possède aucun{' '}
            <a
              rel="noreferrer noopener nofollow"
              target="_blank"
              href="https://www.inpi.fr/fr/faq/qu-est-ce-qu-un-beneficiaire-effectif"
            >
              bénéficiaire effectif
            </a>{' '}
            enregistré au{' '}
            <b>Registre National du Commerce et des Sociétés (RNCS)</b> tenu par
            l’
            <INPI />.
          </p>
        ) : (
          <>
            {immatriculationRNCS.metadata.isFallback && (
              <InpiPartiallyDownWarning missing="la date de déclaration, et la différence entre le nom et le prénom" />
            )}
            <p>
              Cette entreprise possède {beneficiaires.length}{' '}
              <a
                rel="noreferrer noopener nofollow"
                target="_blank"
                href="https://www.inpi.fr/fr/faq/qu-est-ce-qu-un-beneficiaire-effectif"
              >
                bénéficiaire{plural} effectif{plural}
              </a>{' '}
              enregistré{plural} au{' '}
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
            <FullTable
              head={['Date de déclaration', 'Détails', 'Nationalité']}
              body={beneficiaires.map((beneficiaire) =>
                formtInfos(beneficiaire)
              )}
            />
          </>
        )}
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
