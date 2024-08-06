import React from 'react';
import {
  estDiffusible,
  nonDiffusibleDataFormatter,
} from '#models/core/diffusion';
import { IUniteLegale } from '#models/core/types';
import { EScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';

const ExtraitRNELink: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  return estDiffusible(uniteLegale) ||
    hasRights(session, EScope.nonDiffusible) ? (
    <a
      target="_blank"
      rel="noopener"
      href={`/justificatif-immatriculation-pdf/${uniteLegale.siren}`}
    >
      télécharger
    </a>
  ) : (
    <a href="/faq/justificatif-immatriculation-non-diffusible">
      {nonDiffusibleDataFormatter('document non-diffusible')}
    </a>
  );
};

export default ExtraitRNELink;
