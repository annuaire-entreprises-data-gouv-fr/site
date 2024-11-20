'use client';

import routes from '#clients/routes';
import { Info } from '#components-ui/alerts';
import InpiPartiallyDownWarning from '#components-ui/alerts-with-explanations/inpi-partially-down';
import { INPI } from '#components/administrations';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { UniteLegalePageLink } from '#components/unite-legale-page-link';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import DirigeantsContentProtected from './content';

type IProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

/**
 * Dirigeants section protected
 */
export default function DirigeantsSectionProtected({
  uniteLegale,
  session,
}: IProps) {
  const dirigeants = useAPIRouteData(
    APIRoutesPaths.EspaceAgentDirigeantsProtected,
    uniteLegale.siren,
    session
  );

  return (
    <AsyncDataSectionClient
      id="dirigeants-section-protected"
      title="Dirigeant(s)"
      sources={[EAdministration.INPI, EAdministration.INFOGREFFE]}
      data={dirigeants}
      isProtected={true}
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

            <Info>
              Ces informations proviennent du RNE et sont issues d‘une
              comparaison entre les données issues de l’
              <INPI /> et celles d’Infogreffe (qui procure les dates de
              naissance complètes).
            </Info>

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
                  &nbsp;:
                </p>

                <DirigeantsContentProtected
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
