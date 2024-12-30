import routes from '#clients/routes';
import { IBilansProtected } from '#models/espace-agent/bilans';
import { Siren } from '#utils/helpers';
import clientAPIEntreprise from '../client';
import { IAPIEntrepriseBanqueDeFranceBilans } from './types';

/**
 * GET association from API Entreprise
 */
export async function clientApiEntrepriseBilans(siren: Siren) {
  return await clientAPIEntreprise<
    IAPIEntrepriseBanqueDeFranceBilans,
    IBilansProtected
  >(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.banqueDeFrance.bilans(siren)}`,
    mapToDomainObject
  );
}
const mapToDomainObject = (
  response: IAPIEntrepriseBanqueDeFranceBilans
): IBilansProtected => {
  return response.data.map((item) => {
    return {
      annee: item.data.annee,
      dateArreteExercice: item.data.date_arrete_exercice,
      besoinEnFondsDeRoulement:
        item.data.valeurs_calculees[0]?.besoin_en_fonds_de_roulement?.valeur ??
        '',
      capaciteAutofinancement:
        item.data.valeurs_calculees[0]?.capacite_autofinancement?.valeur ?? '',
      dettes4MaturiteAUnAnAuPlus:
        item.data.valeurs_calculees[0]?.dettes4_maturite_a_un_an_au_plus
          ?.valeur ?? '',
      disponibilites:
        item.data.valeurs_calculees[0]?.disponibilites?.valeur ?? '',
      excedentBrutExploitation:
        item.data.valeurs_calculees[0]?.excedent_brut_exploitation?.valeur ??
        '',
      fondsRoulementNetGlobal:
        item.data.valeurs_calculees[0]?.fonds_roulement_net_global?.valeur ??
        '',
      ratioFondsRoulementNetGlobalSurBesoinEnFondsDeRoulement:
        item.data.valeurs_calculees[0]
          ?.ratio_fonds_roulement_net_global_sur_besoin_en_fonds_de_roulement
          ?.valeur ?? '',
      totalDettesStables:
        item.data.valeurs_calculees[0]?.total_dettes_stables?.valeur ?? '',
      valeurAjouteeBdf:
        item.data.valeurs_calculees[0]?.valeur_ajoutee_bdf?.valeur ?? '',
    };
  });
};
