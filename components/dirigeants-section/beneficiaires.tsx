import React from 'react';
import routes from '#clients/routes';
import InpiPartiallyDownWarning from '#components-ui/alerts/inpi-partially-down';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { INPI } from '#components/administrations';
import { Section } from '#components/section';
import { LoadingSection } from '#components/section/loading';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import { IAPILoading, isAPILoading } from '#models/api-loading';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IBeneficiaire, IImmatriculationRNE } from '#models/immatriculation';
import { Siren, formatDatePartial } from '#utils/helpers';
import AdministrationNotResponding from '../administration-not-responding';

type IProps = {
  immatriculationRNE:
    | IImmatriculationRNE
    | IAPINotRespondingError
    | IAPILoading;
  siren: Siren;
};

/**
 * Dirigeants section
 * @param param0
 * @returns
 */
const BeneficiairesSection: React.FC<IProps> = ({
  immatriculationRNE,
  siren,
}) => {
  if (isAPILoading(immatriculationRNE)) {
    return (
      <LoadingSection
        id="beneficiaires"
        title={`Bénéficiaire effectif`}
        description="Nous récupérons les informations sur les bénéficiaires effectifs dans le Registre National des Entreprises"
        sources={[EAdministration.INPI]}
      />
    );
  }
  if (isAPINotResponding(immatriculationRNE)) {
    if (immatriculationRNE.errorType === 404) {
      return null;
    }
    return (
      <AdministrationNotResponding
        administration={immatriculationRNE.administration}
        errorType={immatriculationRNE.errorType}
        title="Bénéficiaires Effectifs"
      />
    );
  }

  const { beneficiaires } = immatriculationRNE;

  const formtInfos = (beneficiaire: IBeneficiaire) => [
    beneficiaire.nationalite,
    <>
      {beneficiaire.prenoms}
      {beneficiaire.prenoms && ' '}
      {(beneficiaire.nom || '').toUpperCase()}, né(e) en{' '}
      {formatDatePartial(beneficiaire.dateNaissancePartial)}
    </>,
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
        {immatriculationRNE.beneficiaires.length === 0 ? (
          <p>
            Cette structure ne possède aucun{' '}
            <a
              rel="noreferrer noopener"
              target="_blank"
              href="https://www.inpi.fr/fr/faq/qu-est-ce-qu-un-beneficiaire-effectif"
            >
              bénéficiaire effectif
            </a>{' '}
            enregistré au <b>Registre National des Entreprises (RNE)</b> tenu
            par l’
            <INPI />.
          </p>
        ) : (
          <>
            {immatriculationRNE.metadata.isFallback && (
              <InpiPartiallyDownWarning missing="la date de déclaration, et la différence entre le nom et le prénom" />
            )}
            <p>
              Cette entreprise possède {beneficiaires.length}{' '}
              <a
                rel="noreferrer noopener"
                target="_blank"
                href="https://www.inpi.fr/fr/faq/qu-est-ce-qu-un-beneficiaire-effectif"
              >
                bénéficiaire{plural} effectif{plural}
              </a>{' '}
              enregistré{plural} au{' '}
              <b>Registre National des Entreprises (RNE)</b> tenu par l’
              <INPI />. Retrouvez le détail des modalités de contrôle sur{' '}
              <a
                rel="noreferrer noopener"
                target="_blank"
                href={`${routes.rne.portail.entreprise}${siren}`}
              >
                la page de cette entreprise
              </a>{' '}
              sur le site de l’INPI&nbsp;:
            </p>
            <FullTable
              head={['Nationalité', 'Détails']}
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
