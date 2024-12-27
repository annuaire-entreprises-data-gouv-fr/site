'use client';

import FAQLink from '#components-ui/faq-link';
import { Icon } from '#components-ui/icon/wrapper';
import InformationTooltip from '#components-ui/information-tooltip';
import { Loader } from '#components-ui/loader';
import { GIPMDS, INSEE } from '#components/administrations';
import { ProtectedInlineData } from '#components/protected-inline-data';
import { isAPI404 } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { hasAnyError, isDataLoading } from '#models/data-fetching';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { libelleTrancheEffectif } from '#utils/helpers/formatting/codes-effectifs';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

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

export const EffectifProtected = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => {
  const effectifsAnnuelsProtected = useAPIRouteData(
    APIRoutesPaths.EspaceAgentEffectifsAnnuelsProtected,
    uniteLegale.siren,
    session
  );

  if (isDataLoading(effectifsAnnuelsProtected)) {
    return (
      <>
        <Loader />
        &nbsp;
      </>
    );
  }

  if (isAPI404(effectifsAnnuelsProtected)) {
    return null;
  }

  if (hasAnyError(effectifsAnnuelsProtected)) {
    return (
      <InformationTooltip
        tabIndex={0}
        label={
          <>
            Nous n’avons pas pu récupérer les effectifs de cette structure car
            le téléservice ne fonctionne pas actuellement. Merci de ré-essayer
            plus tard.
          </>
        }
        horizontalOrientation="left"
        left="5px"
      >
        <Icon slug="errorFill" color="#df0a00">
          <em>Service indisponible</em>
        </Icon>
      </InformationTooltip>
    );
  }

  const { effectif, anneeEffectif } = effectifsAnnuelsProtected;
  return (
    <ul>
      <li>
        Tranche statistiques (<INSEE />) :{' '}
        {libelleTrancheEffectif(
          uniteLegale.trancheEffectif,
          uniteLegale.anneeTrancheEffectif
        )}
      </li>
      <li>
        <span>
          <FAQEffectifAnnuel /> (<GIPMDS />) :{' '}
        </span>
        <ProtectedInlineData>
          {effectif} salarié{effectif > 1 ? 's' : ''}, en {anneeEffectif}
        </ProtectedInlineData>
      </li>
    </ul>
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
    return <EffectifProtected uniteLegale={uniteLegale} session={session} />;
  }
  return libelleTrancheEffectif(
    uniteLegale.trancheEffectif,
    uniteLegale.anneeTrancheEffectif
  );
};
