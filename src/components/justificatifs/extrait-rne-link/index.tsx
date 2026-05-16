import type React from "react";
import ButtonLink from "#/components-ui/button";
import { Icon } from "#/components-ui/icon/wrapper";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import {
  documentNonDiffusiblePlaceHolder,
  estDiffusible,
} from "#/models/core/diffusion";
import type { IUniteLegale } from "#/models/core/types";

const ExtraitRNELink: React.FC<{
  uniteLegale: IUniteLegale;
  label?: string;
  user: IAgentInfo | null;
}> = ({ uniteLegale, label, user }) =>
  estDiffusible(uniteLegale) ||
  hasRights({ user }, ApplicationRights.nonDiffusible) ? (
    <ButtonLink
      alt
      small
      to={`/justificatif-immatriculation-pdf/${uniteLegale.siren}`}
    >
      <Icon slug="download">{label || "télécharger"}</Icon>
    </ButtonLink>
  ) : (
    documentNonDiffusiblePlaceHolder(uniteLegale)
  );

export default ExtraitRNELink;
