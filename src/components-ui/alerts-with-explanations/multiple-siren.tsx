import { INSEE } from "#/components/administrations";
import { Link } from "#/components/link";
import type { IUniteLegale } from "#/models/core/types";
import { formatIntFr } from "#/utils/helpers";
import { Warning } from "../alerts";

const MultipleSirenAlert: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => (
  <>
    {uniteLegale.sirenConserve && (
      <Warning full>
        Cette unité est inscrite en double à l’
        <INSEE /> : {formatIntFr(uniteLegale.siren)} et{" "}
        {formatIntFr(uniteLegale.sirenConserve)}. Pour voir les informations
        complètes, consultez la page{" "}
        <Link
          params={{ slug: uniteLegale.sirenConserve }}
          to="/entreprise/$slug"
        >
          {formatIntFr(uniteLegale.sirenConserve)}
        </Link>
        .
      </Warning>
    )}
  </>
);
export default MultipleSirenAlert;
