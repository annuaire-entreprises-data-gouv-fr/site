import { estNonDiffusibleStrict } from '#models/core/diffusion';
import { IUniteLegale } from '#models/core/types';
import { Warning } from '../alerts';

const NoSiegeSocialAlert: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => {
  /* non-diffusible = likely to have empty siege as no information given by insee */
  if (estNonDiffusibleStrict(uniteLegale)) {
    return null;
  }

  if (uniteLegale.siege.siret !== '') {
    return null;
  }

  return (
    <Warning full>
      Nous ne disposons pas des informations concernant le{' '}
      <strong>siège social</strong> de cette structure.
    </Warning>
  );
};
export default NoSiegeSocialAlert;
