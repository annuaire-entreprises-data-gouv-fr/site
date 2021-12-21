import { IUniteLegale } from '../../models';
import { formatIntFr } from '../../utils/helpers/formatting';
import { INSEE } from '../administrations';
import Warning from './warning';

const MultipleSirenAlert: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => (
  <>
    {uniteLegale.oldSiren !== uniteLegale.siren && (
      <Warning full>
        Cette unité est inscrite en double à l’
        <INSEE /> : {formatIntFr(uniteLegale.oldSiren)} et{' '}
        {formatIntFr(uniteLegale.siren)}. Pour voir les informations complètes,
        consultez la page{' '}
        <a href={`/entreprise/${uniteLegale.siren}`}>
          {formatIntFr(uniteLegale.siren)}
        </a>
        .
      </Warning>
    )}
  </>
);
export default MultipleSirenAlert;
