import { GIPMDS, INSEE } from "#/components/administrations";
import NonRenseigne from "#/components/non-renseigne";
import FAQLink from "#/components-ui/faq-link";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import type { IUniteLegale } from "#/models/core/types";
import { libelleTrancheEffectif } from "#/utils/helpers/formatting/codes-effectifs";

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
  return null;
  // const input = useMemo(
  //   () => ({ siren: uniteLegale.siren }),
  //   [uniteLegale.siren]
  // );
  // const effectifsAnnuelsProtected = useServerFnData(
  //   getAgentEffectifsAnnuelsProtectedFn,
  //   input,
  //   ApplicationRights.effectifs
  // );

  // if (isDataLoading(effectifsAnnuelsProtected)) {
  //   return (
  //     <ProtectedInlineData>
  //       <Loader />
  //       &nbsp;
  //     </ProtectedInlineData>
  //   );
  // }

  // if (isAPI404(effectifsAnnuelsProtected)) {
  //   return <ProtectedInlineData>Pas de données</ProtectedInlineData>;
  // }

  // if (hasAnyError(effectifsAnnuelsProtected)) {
  //   return (
  //     <InformationTooltip
  //       horizontalOrientation="left"
  //       label={
  //         <>
  //           Nous n’avons pas pu récupérer les effectifs de cette structure car
  //           le téléservice ne fonctionne pas actuellement. Merci de ré-essayer
  //           plus tard.
  //         </>
  //       }
  //       left="5px"
  //       tabIndex={0}
  //     >
  //       <Icon color="#df0a00" slug="errorFill">
  //         <em>Service indisponible</em>
  //       </Icon>
  //     </InformationTooltip>
  //   );
  // }

  // const { effectif, anneeEffectif } = effectifsAnnuelsProtected;
  // return (
  //   <ProtectedInlineData>
  //     {formatFloatFr(effectif.toString())} salarié{effectif > 1 ? "s" : ""}, en{" "}
  //     {anneeEffectif}
  //   </ProtectedInlineData>
  // );
};

export const EffectifCell = ({
  uniteLegale,
  user,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}) => {
  if (hasRights({ user }, ApplicationRights.effectifs)) {
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
