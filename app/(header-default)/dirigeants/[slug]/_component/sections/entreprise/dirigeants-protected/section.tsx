"use client";

import { useMemo } from "react";
import { getAgentDirigeantsProtectedAction } from "server-actions/agent/data-fetching";
import routes from "#clients/routes";
import { INPI } from "#components/administrations";
import { AsyncDataSectionClient } from "#components/section/data-section/client";
import { UniteLegalePageLink } from "#components/unite-legale-page-link";
import { Info } from "#components-ui/alerts";
import InpiPartiallyDownWarning from "#components-ui/alerts-with-explanations/inpi-partially-down";
import { useServerActionData } from "#hooks/fetch/use-server-action-data";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import {
  type IUniteLegale,
  isEntrepreneurIndividuel,
} from "#models/core/types";
import { pluralize } from "#utils/helpers";
import DirigeantsContentProtected from "./content";

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
  const isEI = isEntrepreneurIndividuel(uniteLegale);
  const input = useMemo(
    () => ({
      siren: uniteLegale.siren,
      isEI,
    }),
    [isEI]
  );
  const dirigeants = useServerActionData(
    getAgentDirigeantsProtectedAction,
    session,
    input
  );

  return (
    <AsyncDataSectionClient
      data={dirigeants}
      id="dirigeants-section-protected"
      isProtected={true}
      notFoundInfo={
        <>
          Cette structure n’est pas enregistrée au{" "}
          <strong>Registre National des Entreprises (RNE)</strong>
        </>
      }
      sources={[EAdministration.INPI, EAdministration.INFOGREFFE]}
      title="Dirigeant(s)"
    >
      {(dirigeants) => {
        const plural = pluralize(dirigeants.data);
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
