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
      Nous n’avons pas retrouvé d’information concernant le{' '}
      <strong>siège social</strong> de cette structure.
    </Error>
  );
};
export default NoSiegeSocialAlert;
