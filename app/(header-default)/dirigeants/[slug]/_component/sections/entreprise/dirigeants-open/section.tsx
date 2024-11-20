'use client';
import routes from '#clients/routes';
import InpiPartiallyDownWarning from '#components-ui/alerts-with-explanations/inpi-partially-down';
import { INPI } from '#components/administrations';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { UniteLegalePageLink } from '#components/unite-legale-page-link';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import DirigeantsContent from './content';

type IProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

/**
 * Dirigeants section
 */
export default function DirigeantsSection({ uniteLegale, session }: IProps) {
  const dirigeants = useAPIRouteData(
    APIRoutesPaths.RneDirigeants,
    uniteLegale.siren,
    session
  );

  return (
    <AsyncDataSectionClient
      id="dirigeants-section"
      title="Dirigeant(s)"
      sources={[EAdministration.INPI]}
      data={dirigeants}
      isProtected={false}
      notFoundInfo={
        <>
          Cette structure n’est pas enregistrée au{' '}
          <strong>Registre National des Entreprises (RNE)</strong>
        </>
      }
    >
      {(dirigeants) => {
        const plural = dirigeants.data.length > 1 ? 's' : '';
        return (
          <>
            {dirigeants.metadata?.isFallback && <InpiPartiallyDownWarning />}
            {dirigeants.data.length === 0 ? (
              <p>
                Cette entreprise est enregistrée au{' '}
                <strong>Registre National des Entreprises (RNE)</strong>, mais
                n’y possède aucun dirigeant.
              </p>
            ) : (
              <>
                <p>
                  Cette entreprise possède {dirigeants.data.length} dirigeant
                  {plural} enregistré{plural} au{' '}
                  <strong>Registre National des Entreprises (RNE)</strong> tenu
                  par l’
                  <INPI />. Pour en savoir plus, vous pouvez consulter{' '}
                  <UniteLegalePageLink
                    href={`${routes.rne.portail.entreprise}${uniteLegale.siren}`}
                    uniteLegale={uniteLegale}
                    siteName="le site de l’INPI"
                  />
                  .
                </p>
                <p>
                  <strong>NB :</strong> si vous êtes agent public, vous pouvez
                  accéder à l’etat civil complet (lieu et date de naissance
                  complète) en vous connectant à{' '}
                  <a href="/lp/agent-public">l’espace agent public</a>.
                </p>

                <DirigeantsContent
                  dirigeants={dirigeants}
                  uniteLegale={uniteLegale}
                />
              </>
            )}
          </>
        );
      }}
    </AsyncDataSectionClient>
  );
}
