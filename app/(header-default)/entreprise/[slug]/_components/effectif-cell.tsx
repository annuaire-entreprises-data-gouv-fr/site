import { Suspense } from "react";
import { getAgentEffectifsAnnuelsProtectedFetcher } from "server-fetch/agent";
import { GIPMDS, INSEE } from "#components/administrations";
import NonRenseigne from "#components/non-renseigne";
import { ProtectedInlineData } from "#components/protected-inline-data";
import FAQLink from "#components-ui/faq-link";
import { Loader } from "#components-ui/loader";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { libelleTrancheEffectif } from "#utils/helpers/formatting/codes-effectifs";
import { EffectifCellContent } from "./effectif-cell-content";

export const FAQEffectifAnnuel = () => (
  <FAQLink tooltipLabel="Effectif annuel">
    L’effectif moyen annuel (EMA), correspond à la somme des effectifs moyens
    mensuels (EMM) de tous les établissements, divisée par le nombre de mois au
    cours desquels des salariés ont été employés.
    <br />
    Ces données sont issues du Répertoire Commun des Déclarants (RCD) et
    réservées aux agents publics.
  </FAQLink>
);

export const ProtectedEffectifCell = ({
  uniteLegale,
}: {
  uniteLegale: IUniteLegale;
}) => {
  const effectifsAnnuelsProtected = getAgentEffectifsAnnuelsProtectedFetcher(
    uniteLegale.siren
  );

  return (
    <Suspense
      fallback={
        <ProtectedInlineData>
          <Loader />
          &nbsp;
        </ProtectedInlineData>
      }
    >
      <EffectifCellContent
        effectifsAnnuelsProtected={effectifsAnnuelsProtected}
      />
    </Suspense>
  );
};

export const EffectifCell = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => {
  if (hasRights(session, ApplicationRights.effectifsAnnuels)) {
    return (
      <ul>
        <li>
          Tranche statistique (<INSEE />) :{" "}
          {libelleTrancheEffectif(
            uniteLegale.trancheEffectif,
            uniteLegale.anneeTrancheEffectif
          )}
        </li>
        <li>
          <span>
            <FAQEffectifAnnuel /> (<GIPMDS />) :{" "}
          </span>
          <ProtectedEffectifCell uniteLegale={uniteLegale} />
        </li>
      </ul>
    );
  }
  const effectif = libelleTrancheEffectif(
    uniteLegale.trancheEffectif,
    uniteLegale.anneeTrancheEffectif
  );
  return effectif ?? <NonRenseigne />;
};
