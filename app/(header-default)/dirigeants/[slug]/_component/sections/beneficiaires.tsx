'use client';

import React from 'react';
import routes from '#clients/routes';
import { Warning } from '#components-ui/alerts';
import InpiPartiallyDownWarning from '#components-ui/alerts-with-explanations/inpi-partially-down';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { INPI } from '#components/administrations';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { UniteLegalePageLink } from '#components/unite-legale-page-link';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { IDataFetchingState } from '#models/data-fetching';
import { IBeneficiaire, IImmatriculationRNE } from '#models/immatriculation';
import { formatDatePartial } from '#utils/helpers';

type IProps = {
  immatriculationRNE:
    | IImmatriculationRNE
    | IAPINotRespondingError
    | IDataFetchingState;
  uniteLegale: IUniteLegale;
};

function hasSeveralBeneficiaires(immatriculationRNE: IImmatriculationRNE) {
  return immatriculationRNE.beneficiaires.length > 1;
}

/**
 * Dirigeants section
 * @param param0
 * @returns
 */
const BeneficiairesSection: React.FC<IProps> = ({
  immatriculationRNE,
  uniteLegale,
}) => {
  return (
    <>
      <HorizontalSeparator />
      <AsyncDataSectionClient
        id="beneficiaires"
        title="Bénéficiaire(s) effectif(s)"
        sources={[EAdministration.INPI]}
        notFoundInfo={
          <>
            Cette structure n’est pas enregistrée au{' '}
            <strong>Registre National des Entreprises (RNE)</strong>
          </>
        }
        data={immatriculationRNE}
      >
        {(immatriculationRNE) => (
          <BénéficiairesContent
            immatriculationRNE={immatriculationRNE}
            uniteLegale={uniteLegale}
          />
        )}
      </AsyncDataSectionClient>
    </>
  );
};
export default BeneficiairesSection;

type IBeneficiairesContentProps = {
  immatriculationRNE: IImmatriculationRNE;
  uniteLegale: IUniteLegale;
};
function BénéficiairesContent({
  immatriculationRNE,
  uniteLegale,
}: IBeneficiairesContentProps) {
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

  const plural = hasSeveralBeneficiaires(immatriculationRNE) ? 's' : '';

  return (
    <>
      <WarningRBE />
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
          enregistré au <strong>Registre National des Entreprises (RNE)</strong>{' '}
          tenu par l’
          <INPI />.
        </p>
      ) : (
        <>
          {immatriculationRNE.metadata.isFallback && (
            <InpiPartiallyDownWarning />
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
            <strong>Registre National des Entreprises (RNE)</strong> tenu par l’
            <INPI />. Retrouvez le détail des modalités de contrôle sur{' '}
            <UniteLegalePageLink
              uniteLegale={uniteLegale}
              href={`${routes.rne.portail.entreprise}${uniteLegale.siren}`}
              siteName="le site de l’INPI"
            />
            &nbsp;:
          </p>
          <FullTable
            head={['Nationalité', 'Détails']}
            body={beneficiaires.map((beneficiaire) => formtInfos(beneficiaire))}
          />
        </>
      )}
      <style global jsx>{`
        table > tbody > tr > td:first-of-type {
          width: 30%;
        }
      `}</style>
    </>
  );
}

const WarningRBE = () => (
  <Warning>
    À compter du 31 juillet 2024, le registre des bénéficiaires effectifs n’est
    plus accessible au public, en application de la{' '}
    <a
      href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049761732"
      target="_blank"
      rel="noopener noreferrer"
    >
      directive européenne 2024/1640 du 31 mai 2024
    </a>
    . Désormais, seules les{' '}
    <a
      href="https://www.inpi.fr/faq/qui-peut-acceder-aux-donnees-des-beneficiaires-effectifs"
      target="_blank"
      rel="noopener noreferrer"
    >
      personnes en mesure de justifier d’un intérêt légitime
    </a>{' '}
    peuvent{' '}
    <a
      href="https://data.inpi.fr/content/editorial/acces_BE"
      target="_blank"
      rel="noopener noreferrer"
    >
      effectuer une demande d’accès
    </a>{' '}
    au registre auprès de l’
    <INPI />.
  </Warning>
);
