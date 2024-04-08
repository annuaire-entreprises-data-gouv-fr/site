import { estNonDiffusible } from '#models/core/statut-diffusion';
import { IUniteLegale } from '#models/core/types';
import { Error } from '../alerts';

const NoSiegeSocialAlert: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => {
  /* non-diffusible = likely to have empty siege as no information given by insee */
  if (estNonDiffusible(uniteLegale)) {
    return null;
  }

  if (uniteLegale.siege.siret !== '') {
    return null;
  }

  return (
    <Error full>
      Cette structure n’a pas de <strong>siège social</strong>.
    </Error>
  );
};
export default NoSiegeSocialAlert;
