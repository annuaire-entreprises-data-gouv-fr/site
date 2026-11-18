import {
  estDiffusible,
  estNonDiffusibleProtected,
  estNonDiffusibleStrict,
  type ISTATUTDIFFUSION,
} from "#/models/core/diffusion";
import { Tag } from "..";

export const NonDiffusibleTag: React.FC<{
  etablissementOrUniteLegale: {
    statutDiffusion: ISTATUTDIFFUSION;
  };
}> = ({ etablissementOrUniteLegale }) => {
  if (estDiffusible(etablissementOrUniteLegale)) {
    return null;
  }
  if (estNonDiffusibleProtected(etablissementOrUniteLegale)) {
    return <Tag color="new">protégé</Tag>;
  }
  if (estNonDiffusibleStrict(etablissementOrUniteLegale)) {
    return <Tag color="new">non diffusée</Tag>;
  }
  return <Tag color="new">diffusion partielle</Tag>;
};
