import routes from '#clients/routes';
import { INPI } from '#components/administrations';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { UniteLegalePageLink } from '#components/unite-legale-page-link';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { IBeneficairesEffectif } from '#models/espace-agent/beneficiaires';
import { ISession } from '#models/user/session';
import { formatDatePartial } from '#utils/helpers';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import ResetUseCase from './reset-use-case';

/**
 * Dirigeants section
 * @param param0
 * @returns
 */
const ProtectedBeneficiairesSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
  onUseCaseReset: () => void;
}> = ({ uniteLegale, session, onUseCaseReset }) => {
  const beneficiaires = useAPIRouteData(
    'espace-agent/beneficiaires',
    uniteLegale.siren,
    session
  );

  return (
    <>
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
        data={beneficiaires}
        isProtected
      >
        {(beneficiaires) => (
          <>
            <ResetUseCase session={session} onUseCaseReset={onUseCaseReset} />
            <BénéficiairesContent
              beneficiaires={beneficiaires}
              uniteLegale={uniteLegale}
            />
          </>
        )}
      </AsyncDataSectionClient>
    </>
  );
};

function BénéficiairesContent({
  beneficiaires,
  uniteLegale,
}: {
  beneficiaires: IBeneficairesEffectif[];
  uniteLegale: IUniteLegale;
}) {
  const formatInfos = (beneficiaire: IBeneficairesEffectif) => [
    <>
      {beneficiaire.prenoms}
      {beneficiaire.prenoms && ' '}
      {(beneficiaire.nom || '').toUpperCase()}, né(e) en{' '}
      {formatDatePartial(
        `${beneficiaire.anneeNaissance}-${beneficiaire.moisNaissance}-00`
      )}
      {beneficiaire.nationalite && ` (${beneficiaire.nationalite})`}
    </>,
    beneficiaire.paysResidence,
    <i>Détail des modalités</i>,
  ];

  const plural = beneficiaires.length > 1 ? 's' : '';

  return (
    <>
      {beneficiaires.length === 0 ? null : (
        <>
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
            head={['Bénéficiaire', 'Pays de résidence', 'Modalité de controle']}
            body={beneficiaires.map((beneficiaire) =>
              formatInfos(beneficiaire)
            )}
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

export default ProtectedBeneficiairesSection;
