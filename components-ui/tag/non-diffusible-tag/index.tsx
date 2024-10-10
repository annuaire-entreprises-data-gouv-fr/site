import {
  ISTATUTDIFFUSION,
  estDiffusible,
  estNonDiffusibleProtected,
} from '#models/core/diffusion';
import { Tag } from '..';

export const NonDiffusibleTag: React.FC<{
  etablissementOrUniteLegale: {
    statutDiffusion: ISTATUTDIFFUSION;
  };
}> = ({ etablissementOrUniteLegale }) =>
  !estDiffusible(etablissementOrUniteLegale) ? (
    estNonDiffusibleProtected(etablissementOrUniteLegale) ? (
      <Tag color="new">protégé</Tag>
    ) : (
      <Tag color="new">non-diffusible</Tag>
    )
  ) : null;
