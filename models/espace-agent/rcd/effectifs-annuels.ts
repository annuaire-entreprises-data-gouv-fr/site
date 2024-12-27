import { clientApiEntrepriseRcdEffectifsAnnuels } from '#clients/api-entreprise/rcd/effectifs-annuels';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { verifySiren } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';

export type IRcdEffectifsAnnuelsProtected = {
  trancheEffectif: number;
  anneeTrancheEffectif: number;
};

export const getRcdEffectifsAnnuelsProtected = async (
  maybeSiren: string
): Promise<IRcdEffectifsAnnuelsProtected | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  return clientApiEntrepriseRcdEffectifsAnnuels(siren).catch((error) =>
    handleApiEntrepriseError(error, {
      siren,
      apiResource: 'getRcdEffectifsAnnuelsProtected',
    })
  );
};
