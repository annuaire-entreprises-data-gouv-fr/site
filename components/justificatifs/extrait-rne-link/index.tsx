import {
  estDiffusible,
  nonDiffusibleDataFormatter,
} from '#models/core/diffusion';
import { IUniteLegale } from '#models/core/types';
import { AppScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import React from 'react';

const ExtraitRNELink: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  return estDiffusible(uniteLegale) ||
    hasRights(session, AppScope.nonDiffusible) ? (
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
