import { clientApiEntrepriseBanqueDeFranceBilans } from '#clients/api-entreprise/banque-de-france/bilans';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { verifySiren } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';

export type IBanqueDeFranceBilansProtected = {
  annee: string;
  date_arrete_exercice: string;
  capacite_autofinancement: string;
  besoin_en_fonds_de_roulement: string;
  dettes4_maturite_a_un_an_au_plus: string;
  disponibilites: string;
  excedent_brut_exploitation: string;
  fonds_roulement_net_global: string;
  ratio_fonds_roulement_net_global_sur_besoin_en_fonds_de_roulement: string;
  total_dettes_stables: string;
  valeur_ajoutee_bdf: string;
}[];

export const getBanqueDeFranceBilansProtected = async (
  maybeSiren: string
): Promise<IBanqueDeFranceBilansProtected | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  return clientApiEntrepriseBanqueDeFranceBilans(siren).catch((error) =>
    handleApiEntrepriseError(error, {
      siren,
      apiResource: 'getBanqueDeFranceBilansProtected',
    })
  );
};
