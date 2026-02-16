"use client";
import { APIRoutesPaths } from "app/api/data-fetching/routes-paths";
import { useAPIRouteData } from "hooks/fetch/use-API-route-data";
import routes from "#clients/routes";
import { INPI } from "#components/administrations";
import { Link } from "#components/Link";
import { AsyncDataSectionClient } from "#components/section/data-section/client";
import { UniteLegalePageLink } from "#components/unite-legale-page-link";
import InpiPartiallyDownWarning from "#components-ui/alerts-with-explanations/inpi-partially-down";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { pluralize } from "#utils/helpers";
import DirigeantsContent from "./content";

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
      data={dirigeants}
      id="dirigeants-section"
      isProtected={false}
      notFoundInfo={
        <>
          Cette structure n’est pas enregistrée au{" "}
          <strong>Registre National des Entreprises (RNE)</strong>
        </>
      }
      sources={[EAdministration.INPI]}
      title="Dirigeant(s)"
    >
      {(dirigeants) => {
        const plural = pluralize(dirigeants.data);
        return (
          <>
            {dirigeants.metadata?.isFallback && <InpiPartiallyDownWarning />}
            {dirigeants.data.length === 0 ? (
              <p>
                Cette entreprise est enregistrée au{" "}
                <strong>Registre National des Entreprises (RNE)</strong>, mais
                n’y possède aucun dirigeant.
              </p>
            ) : (
              <>
                <p>
                  Cette entreprise possède {dirigeants.data.length} dirigeant
                  {plural} enregistré{plural} au{" "}
                  <strong>Registre National des Entreprises (RNE)</strong> tenu
                  par l’
                  <INPI />. Pour en savoir plus, vous pouvez consulter{" "}
                  <UniteLegalePageLink
                    href={`${routes.rne.portail.entreprise}${uniteLegale.siren}`}
                    siteName="le site de l’INPI"
                    uniteLegale={uniteLegale}
                  />
                  .
                </p>
                <p>
                  <strong>NB :</strong> si vous êtes agent public, vous pouvez
                  accéder à l’état civil complet (lieu et date de naissance
                  complète) en vous connectant à{" "}
                  <Link href="/lp/agent-public">l’espace agent public</Link>.
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
