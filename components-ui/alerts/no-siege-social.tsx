import { IUniteLegale } from '#models/core/types';
import { Error } from '.';

const NoSiegeSocialAlert: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) =>
  uniteLegale.siege.siret === '' && (
    <Error full>
      Cette structure n’a pas de <b>siège social</b>.
    </Error>
  );

export default NoSiegeSocialAlert;
