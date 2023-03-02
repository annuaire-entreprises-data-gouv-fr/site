import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { Siren } from '#utils/helpers';
import odsClient from '..';
import { IAPIBilanResponse } from './interface';

/**
 * Données financière (Ratios Financiers (BCE / INPI))
 * https://data.economie.gouv.fr/explore/dataset/ratios_inpi_bce/api
 */
export const clientBilansFinanciers = async (siren: Siren) => {
  const url = routes.donneesFinancieres.ods.search;
  const metaDataUrl = routes.donneesFinancieres.ods.metadata;

  const response = await odsClient(
    {
      url,
      config: { params: { q: `siren:${siren}` } },
    },
    metaDataUrl
  );

  return {
    bilans: response.records.map(mapToDomainObject),
    lastModified: response.lastModified,
  };
};

const mapToDomainObject = (financialData: IAPIBilanResponse) => {
  const {
    ratio_de_vetuste = 0,
    rotation_des_stocks_jours = 0,
    marge_ebe = 0,
    resultat_courant_avant_impots_sur_ca = 0,
    couverture_des_interets = 0,
    poids_bfr_exploitation_sur_ca_jours = 0,
    credit_clients_jours = 0,
    chiffre_d_affaires = 0,
    caf_sur_ca = 0,
    ebitda = 0,
    date_cloture_exercice = '',
    ebit = 0,
    marge_brute = 0,
    resultat_net = 0,
    siren,
    poids_bfr_exploitation_sur_ca = 0,
    autonomie_financiere = 0,
    capacite_de_remboursement = 0,
    ratio_de_liquidite = 0,
    taux_d_endettement = 0,
  } = financialData;

  return {
    ratioDeVetuste: ratio_de_vetuste,
    rotationDesStocksJours: rotation_des_stocks_jours,
    margeEbe: marge_ebe,
    resultatCourantAvantImpotsSurCa: resultat_courant_avant_impots_sur_ca,
    couvertureDesInterets: couverture_des_interets,
    poidsBfrExploitationSurCaJours: poids_bfr_exploitation_sur_ca_jours,
    creditClientsJours: credit_clients_jours,
    chiffreDAffaires: chiffre_d_affaires,
    cafSurCa: caf_sur_ca,
    ebitda: ebitda,
    dateClotureExercice: date_cloture_exercice,
    ebit: ebit,
    margeBrute: marge_brute,
    resultatNet: resultat_net,
    siren: siren,
    poidsBfrExploitationSurCa: poids_bfr_exploitation_sur_ca,
    autonomieFinanciere: autonomie_financiere,
    capaciteDeRemboursement: capacite_de_remboursement,
    ratioDeLiquidite: ratio_de_liquidite,
    tauxDEndettement: taux_d_endettement,
  };
};
