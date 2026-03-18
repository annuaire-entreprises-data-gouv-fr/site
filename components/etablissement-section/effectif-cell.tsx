"use client";

import { APIRoutesPaths } from "app/api/data-fetching/routes-paths";
import { useAPIRouteData } from "hooks/fetch/use-API-route-data";
import { GIPMDS, INSEE } from "#components/administrations";
import NonRenseigne from "#components/non-renseigne";
import { ProtectedInlineData } from "#components/protected-inline-data";
import FAQLink from "#components-ui/faq-link";
import { Icon } from "#components-ui/icon/wrapper";
import InformationTooltip from "#components-ui/information-tooltip";
import { Loader } from "#components-ui/loader";
import { isAPI404 } from "#models/api-not-responding";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IEtablissement, IUniteLegale } from "#models/core/types";
import { hasAnyError, isDataLoading } from "#models/data-fetching";
import { formatFloatFr } from "#utils/helpers";
import { libelleTrancheEffectif } from "#utils/helpers/formatting/codes-effectifs";

export const FAQEffectifMensuel = () => (
  <FAQLink tooltipLabel="Effectif mensuel">
    L'effectif moyen mensuel (EMM), correspond à l'effectif moyen des régimes
    général et agricole d'un établissement, issus de l'Urssaf et de la MSA
    depuis le répertoire commun des déclarants opéré par le GIP-MDS. Il inclut
    l'effectif moyen et les effectifs liés à l'obligation d'emploi travailleurs
    handicapés.
    <br />
    Ces données sont issues du Répertoire Commun des Déclarants (RCD) et
    réservées aux agents publics.
  </FAQLink>
);

export const ProtectedEffectifCell = ({
  etablissement,
  session,
}: {
  etablissement: IEtablissement;
  session: ISession | null;
}) => {
  const effectifsMensuelsProtected = useAPIRouteData(
    APIRoutesPaths.EspaceAgentEffectifsMensuelsProtected,
    etablissement.siret,
    session
  );

  if (isDataLoading(effectifsMensuelsProtected)) {
    return (
      <ProtectedInlineData>
        <Loader />
        &nbsp;
      </ProtectedInlineData>
    );
  }

  if (isAPI404(effectifsMensuelsProtected)) {
    return <ProtectedInlineData>Pas de données</ProtectedInlineData>;
  }

  if (hasAnyError(effectifsMensuelsProtected)) {
    return (
      <InformationTooltip
        horizontalOrientation="left"
        label={
          <>
            Nous n’avons pas pu récupérer les effectifs de cet établissement car
            le téléservice ne fonctionne pas actuellement. Merci de ré-essayer
            plus tard.
          </>
        }
        left="5px"
        tabIndex={0}
      >
        <Icon color="#df0a00" slug="errorFill">
          <em>Service indisponible</em>
        </Icon>
      </InformationTooltip>
    );
  }

  const { effectif, anneeEffectif, moisEffectif } = effectifsMensuelsProtected;
  return (
    <ProtectedInlineData>
      {formatFloatFr(effectif.toString())} salarié{effectif > 1 ? "s" : ""}, au{" "}
      {moisEffectif}/{anneeEffectif}
    </ProtectedInlineData>
  );
};

export const EffectifCell = ({
  uniteLegale,
  etablissement,
  session,
}: {
  uniteLegale: IUniteLegale;
  etablissement: IEtablissement;
  session: ISession | null;
}) => {
  if (hasRights(session, ApplicationRights.effectifs)) {
    return (
      <ul>
        <li>
          Tranche statistique (<INSEE />) :{" "}
          {libelleTrancheEffectif(
            uniteLegale.trancheEffectif === "N"
              ? "N"
              : etablissement.trancheEffectif,
            etablissement.anneeTrancheEffectif
          )}
        </li>
        <li>
          <span>
            <FAQEffectifMensuel /> (<GIPMDS />) :{" "}
          </span>
          <ProtectedEffectifCell
            etablissement={etablissement}
            session={session}
          />
        </li>
      </ul>
    );
  }
  const effectif = libelleTrancheEffectif(
    uniteLegale.trancheEffectif === "N" ? "N" : etablissement.trancheEffectif,
    etablissement.anneeTrancheEffectif
  );
  return effectif ?? <NonRenseigne />;
};
