import ButtonLink from "#components-ui/button";
import { Icon } from "#components-ui/icon/wrapper";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import {
  documentNonDiffusiblePlaceHolder,
  estDiffusible,
} from "#models/core/diffusion";
import type { IUniteLegale } from "#models/core/types";
import type React from "react";

const ExtraitRNELink: React.FC<{
  uniteLegale: IUniteLegale;
  label?: string;
  session: ISession | null;
}> = ({ uniteLegale, label, session }) => {
  return estDiffusible(uniteLegale) ||
    hasRights(session, ApplicationRights.nonDiffusible) ? (
    <ButtonLink
      small
      alt
      to={`/justificatif-immatriculation-pdf/${uniteLegale.siren}`}
    >
      <Icon slug="download">{label || "télécharger"}</Icon>
    </ButtonLink>
  ) : (
    <a href="/faq/justificatif-immatriculation-non-diffusible">
      {documentNonDiffusiblePlaceHolder(uniteLegale)}
    </a>
  );
};

export default ExtraitRNELink;
