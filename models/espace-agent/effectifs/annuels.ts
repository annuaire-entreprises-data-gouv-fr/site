import { clientApiEntrepriseEffectifsAnnuels } from '#clients/api-entreprise/effectifs/annuels';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { verifySiren } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';

export type IEffectifsAnnuelsProtected = {
  effectif: number;
  anneeEffectif: string;
};

export const getEffectifsAnnuelsProtected = async (
  maybeSiren: string
): Promise<IEffectifsAnnuelsProtected | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  return clientApiEntrepriseEffectifsAnnuels(siren).catch((error) =>
    handleApiEntrepriseError(error, {
      siren,
      apiResource: 'EffectifsAnnuelsProtected',
    })
  );
};
