import routes from '#clients/routes';
import { IBanqueDeFranceBilansProtected } from '#models/espace-agent/banque-de-france/bilans';
import { Siren } from '#utils/helpers';
import clientAPIEntreprise from '../client';
import { IAPIEntrepriseBanqueDeFranceBilans } from './types';

/**
 * GET association from API Entreprise
 */
export async function clientApiEntrepriseBanqueDeFranceBilans(siren: Siren) {
  return await clientAPIEntreprise<
    IAPIEntrepriseBanqueDeFranceBilans,
    IBanqueDeFranceBilansProtected
  >(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.banqueDeFranceBilans(siren)}`,
    mapToDomainObject
  );
}

const mapToDomainObject = (
  response: IAPIEntrepriseBanqueDeFranceBilans
): IBanqueDeFranceBilansProtected => {
  return response.data.map((item) => {
    return {
      annee: item.data.annee,
      date_arrete_exercice: item.data.date_arrete_exercice,
      besoin_en_fonds_de_roulement:
        item.data.valeurs_calculees[0]?.besoin_en_fonds_de_roulement?.valeur ??
        '',
      capacite_autofinancement:
        item.data.valeurs_calculees[0]?.capacite_autofinancement?.valeur ?? '',
      dettes4_maturite_a_un_an_au_plus:
        item.data.valeurs_calculees[0]?.dettes4_maturite_a_un_an_au_plus
          ?.valeur ?? '',
      disponibilites:
        item.data.valeurs_calculees[0]?.disponibilites?.valeur ?? '',
      excedent_brut_exploitation:
        item.data.valeurs_calculees[0]?.excedent_brut_exploitation?.valeur ??
        '',
      fonds_roulement_net_global:
        item.data.valeurs_calculees[0]?.fonds_roulement_net_global?.valeur ??
        '',
      ratio_fonds_roulement_net_global_sur_besoin_en_fonds_de_roulement:
        item.data.valeurs_calculees[0]
          ?.ratio_fonds_roulement_net_global_sur_besoin_en_fonds_de_roulement
          ?.valeur ?? '',
      total_dettes_stables:
        item.data.valeurs_calculees[0]?.total_dettes_stables?.valeur ?? '',
      valeur_ajoutee_bdf:
        item.data.valeurs_calculees[0]?.valeur_ajoutee_bdf?.valeur ?? '',
    };
  });
};
