import type React from "react";
import { Link } from "#components/Link";
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

const ExtraitRNELink: React.FC<{
  uniteLegale: IUniteLegale;
  label?: string;
  session: ISession | null;
}> = ({ uniteLegale, label, session }) =>
  estDiffusible(uniteLegale) ||
  hasRights(session, ApplicationRights.nonDiffusible) ? (
    <ButtonLink
      alt
      small
      to={`/justificatif-immatriculation-pdf/${uniteLegale.siren}`}
    >
      <Icon slug="download">{label || "télécharger"}</Icon>
    </ButtonLink>
  ) : (
    <Link href="/faq/justificatif-immatriculation-non-diffusible">
      {documentNonDiffusiblePlaceHolder(uniteLegale)}
    </Link>
  );

export default ExtraitRNELink;
