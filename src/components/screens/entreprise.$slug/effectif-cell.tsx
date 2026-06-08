import { INSEE } from "#/components/administrations";
import NonRenseigne from "#/components/non-renseigne";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import type { IUniteLegale } from "#/models/core/types";
import { libelleTrancheEffectif } from "#/utils/helpers/formatting/codes-effectifs";

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
      </ul>
    );
  }
  const effectif = libelleTrancheEffectif(
    uniteLegale.trancheEffectif,
    uniteLegale.anneeTrancheEffectif
  );
  return effectif ?? <NonRenseigne />;
};
