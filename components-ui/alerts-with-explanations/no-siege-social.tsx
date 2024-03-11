import { IUniteLegale } from '#models/core/types';
import { Error } from '../alerts';

const NoSiegeSocialAlert: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) =>
  uniteLegale.siege.siret === '' && (
    <Error full>
      Cette structure n’a pas de <strong>siège social</strong>.
    </Error>
  );

export default NoSiegeSocialAlert;
