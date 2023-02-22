import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';
import { IResponseFinance, IRecord } from './interface';

export interface IFinance {
  ratioDeVetuste: number | null;
  rotationDesStocksJours: number | null;
  margeEbe: number | null;
  resultatCourantAvantImpotsSurCa: number | null;
  couvertureDesInterets: number | null;
  poidsBfrExploitationSurCaJours: number | null;
  creditClientsJours: number | null;
  chiffreDAffaires: number | null;
  cafSurCa: number | null;
  ebitda: number | null;
  dateClotureExercice: string;
  ebit: number | null;
  margeBrute: number | null;
  resultatNet: number | null;
  siren: string;
  poidsBfrExploitationSurCa: number | null;
  autonomieFinanciere: number | null;
  capaciteDeRemboursement: number | null;
  ratioDeLiquidite: number | null;
  tauxDEndettement: number | null;
}

/**
 * Données financière (Ratios Financiers (BCE / INPI))
 * https://data.economie.gouv.fr/explore/dataset/ratios_inpi_bce/api
 */
export const clientFinance = async (siren: Siren) => {
  const route = routes.finance;
  const response = await httpGet(route, { params: { q: `siren:${siren}` } });

  const data = response.data as IResponseFinance;

  if (!data.records.length) {
    throw new HttpNotFound(
      `Cannot found financial data associate to siren : ${siren}`
    );
  }
  return data.records.map((financialData) => mapToDomainObject(financialData));
};

const mapToDomainObject = (financialData: IRecord): IFinance => {
  const {
    ratio_de_vetuste = null,
    rotation_des_stocks_jours = null,
    marge_ebe = null,
    resultat_courant_avant_impots_sur_ca = null,
    couverture_des_interets = null,
    poids_bfr_exploitation_sur_ca_jours = null,
    credit_clients_jours = null,
    chiffre_d_affaires = null,
    caf_sur_ca = null,
    ebitda = null,
    date_cloture_exercice = '',
    ebit = null,
    marge_brute = null,
    resultat_net = null,
    siren,
    poids_bfr_exploitation_sur_ca = null,
    autonomie_financiere = null,
    capacite_de_remboursement = null,
    ratio_de_liquidite = null,
    taux_d_endettement = null,
  } = financialData.fields;
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
