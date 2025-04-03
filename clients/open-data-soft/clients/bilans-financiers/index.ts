import { HttpNotFound } from '#clients/exceptions';
import odsClient from '#clients/open-data-soft';
import routes from '#clients/routes';
import {
  IIndicateursFinanciers,
  IIndicateursFinanciersSociete,
} from '#models/finances-societe/types';
import { Siren } from '#utils/helpers';
import { getFiscalYear } from '#utils/helpers/formatting/format-fiscal-year';
import { IAPIBilanResponse } from './interface';

/**
 * Données financière (Ratios Financiers (BCE / INPI))
 * https://data.economie.gouv.fr/explore/dataset/ratios_inpi_bce/api
 */
export const clientBilansFinanciers = async (
  siren: Siren
): Promise<IIndicateursFinanciersSociete> => {
  const url = routes.donneesFinancieres.ods.search;
  const metaDataUrl = routes.donneesFinancieres.ods.metadata;

  const response = await odsClient(
    {
      url,
      config: { params: { q: `siren:${siren}` } },
    },
    metaDataUrl
  );

  if (response.records.length === 0) {
    throw new HttpNotFound(siren);
  }

  const indicateurs = mapToDomainObject(response.records);
  return {
    indicateurs,
    hasBilanConsolide: indicateurs[0].estConsolide,
    lastModified: response.lastModified,
    hasCADGFiP: false,
  };
};

const sortPerYear = (b1: IIndicateursFinanciers, b2: IIndicateursFinanciers) =>
  b1.year - b2.year;

const mapToDomainObject = (
  response: IAPIBilanResponse[]
): IIndicateursFinanciers[] => {
  const allBilans = response.map(mapToBilan);
  allBilans.sort(sortPerYear);
  return allBilans;
};

const mapToBilan = (
  financialData: IAPIBilanResponse
): IIndicateursFinanciers => {
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
    ebe = 0,
    type_bilan = '',
    marge_brute = 0,
    resultat_net = 0,
    siren,
    poids_bfr_exploitation_sur_ca = 0,
    autonomie_financiere = 0,
    capacite_de_remboursement = 0,
    ratio_de_liquidite = 0,
    taux_d_endettement = 0,
    confidentiality,
  } = financialData;

  return {
    confidentiality,
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
    ebe,
    margeBrute: marge_brute,
    resultatNet: resultat_net,
    siren: siren,
    poidsBfrExploitationSurCa: poids_bfr_exploitation_sur_ca,
    autonomieFinanciere: autonomie_financiere,
    capaciteDeRemboursement: capacite_de_remboursement,
    ratioDeLiquidite: ratio_de_liquidite,
    tauxDEndettement: taux_d_endettement,
    type: type_bilan.toUpperCase() ?? '',
    estSimplifie: type_bilan.toUpperCase() === 'S',
    estConsolide: type_bilan.toUpperCase() === 'K',
    estComplet: type_bilan.toUpperCase() === 'C',
    year: getFiscalYear(date_cloture_exercice),
  };
};
