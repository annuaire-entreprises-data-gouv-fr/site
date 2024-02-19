import React from 'react';
import routes from '#clients/routes';
import InpiPartiallyDownWarning from '#components-ui/alerts-with-explanations/inpi-partially-down';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { INPI } from '#components/administrations';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { UniteLegalePageLink } from '#components/unite-legale-page-link';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPILoading } from '#models/api-loading';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { IBeneficiaire, IImmatriculationRNE } from '#models/immatriculation';
import { formatDatePartial } from '#utils/helpers';

type IProps = {
  immatriculationRNE:
    | IImmatriculationRNE
    | IAPINotRespondingError
    | IAPILoading;
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
      <DataSection
        id="beneficiaires"
        title="Bénéficiaire(s) effectif(s)"
        sources={[EAdministration.INPI]}
        notFoundInfo={null}
        data={immatriculationRNE}
      >
        {(immatriculationRNE) => (
          <BénéficiairesContent
            immatriculationRNE={immatriculationRNE}
            uniteLegale={uniteLegale}
          />
        )}
      </DataSection>
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
