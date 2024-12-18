import { clientApiEntrepriseRcpEffectifsAnnuels } from '#clients/api-entreprise/rcp/effectifs-annuels';
import { IAPIEntrepriseRcpEffectifsAnnuels } from '#clients/api-entreprise/rcp/types';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { verifySiren } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';

// TEMP
export type IRcpEffectifsAnnuelsProtected = IAPIEntrepriseRcpEffectifsAnnuels;

export const getRcpEffectifsAnnuelsProtected = async (
  maybeSiren: string
): Promise<IRcpEffectifsAnnuelsProtected | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  return clientApiEntrepriseRcpEffectifsAnnuels(siren).catch((error) =>
    handleApiEntrepriseError(error, {
      siren,
      apiResource: 'getRcpEffectifsAnnuelsProtected',
    })
  );
};
