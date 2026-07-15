import constants from "#/models/constants";
import {
  type IUniteLegale,
  isCollectiviteTerritoriale,
} from "#/models/core/types";

export function getUniteLegaleTheme(
  uniteLegale: IUniteLegale
): React.CSSProperties {
  if (isCollectiviteTerritoriale(uniteLegale)) {
    return {
      "--unite-legale-theme-background": "#ebe7f7",
      "--unite-legale-theme-text": "#1d0d4b",
    } as React.CSSProperties;
  }

  return {
    "--unite-legale-theme-background": constants.colors.pastelBlue,
    "--unite-legale-theme-text": constants.colors.frBlue,
  } as React.CSSProperties;
}
