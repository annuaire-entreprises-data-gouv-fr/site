import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import {
  estDiffusible,
  nonDiffusibleDataFormatter,
} from '#models/core/diffusion';
import { IUniteLegale } from '#models/core/types';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import React from 'react';

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
      <Icon slug="download">{label || 'télécharger'}</Icon>
    </ButtonLink>
  ) : (
    <a href="/faq/justificatif-immatriculation-non-diffusible">
      {nonDiffusibleDataFormatter('document non-diffusible')}
    </a>
  );
};

export default ExtraitRNELink;
