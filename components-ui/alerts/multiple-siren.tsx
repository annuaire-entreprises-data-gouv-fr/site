import { INSEE } from '#components/administrations';
import { IUniteLegale } from '#models/core/types';
import { formatIntFr } from '#utils/helpers';
import { Warning } from '.';

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
        <a href={`/entreprise/${uniteLegale.chemin}`}>
          {formatIntFr(uniteLegale.siren)}
        </a>
        .
      </Warning>
    )}
  </>
);
export default MultipleSirenAlert;
