import React from 'react';
import { IUniteLegale } from '#models/index';
import {
  estDiffusible,
  nonDiffusibleDataFormatter,
} from '#models/statut-diffusion';
import { isAgent } from '#utils/session';
import useSession from 'hooks/use-session';

const ExtraitRNELink: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const session = useSession();

  return estDiffusible(uniteLegale) || isAgent(session) ? (
    <a
      target="_blank"
      rel="noopener"
      href={`/justificatif-immatriculation-pdf/${uniteLegale.siren}`}
    >
      télécharger
    </a>
  ) : (
    <>{nonDiffusibleDataFormatter('document non-diffusible')}</>
  );
};

export default ExtraitRNELink;
