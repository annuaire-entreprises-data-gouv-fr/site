import { INSEE } from "#components/administrations";
import { Link } from "#components/Link";
import type { IUniteLegale } from "#models/core/types";
import { formatIntFr } from "#utils/helpers";
import { Warning } from "../alerts";

const MultipleSirenAlert: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => (
  <>
    {uniteLegale.oldSiren !== uniteLegale.siren && (
      <Warning full>
        Cette unité est inscrite en double à l’
        <INSEE /> : {formatIntFr(uniteLegale.oldSiren)} et{" "}
        {formatIntFr(uniteLegale.siren)}. Pour voir les informations complètes,
        consultez la page{" "}
        <Link href={`/entreprise/${uniteLegale.siren}`}>
          {formatIntFr(uniteLegale.siren)}
        </Link>
        .
      </Warning>
    )}
  </>
);
export default MultipleSirenAlert;
