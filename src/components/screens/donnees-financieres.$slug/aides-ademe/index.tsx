import { hasAidesADEME, type IUniteLegale } from "#/models/core/types";
import AidesADEMEContent from "./aides-ademe-content";

export function AidesADEME({ uniteLegale }: { uniteLegale: IUniteLegale }) {
  if (!hasAidesADEME(uniteLegale)) {
    return null;
  }

  return <AidesADEMEContent uniteLegale={uniteLegale} />;
}
