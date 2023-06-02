import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { IBilanFinancier } from '#models/donnees-financieres';
import { Siren, formatDateYear } from '#utils/helpers';
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

  if (response.records.length === 0) {
    throw new HttpNotFound(siren);
  }

  const bilans = mapToDomainObject(response.records);

  return {
    bilans,
    hasBilanConsolide: bilans[0].estConsolide,
    lastModified: response.lastModified,
  };
};

const groupPerYear = (
  bilansPerYear: { [year: string]: IBilanFinancier },
  bilan: IBilanFinancier
) => {
  bilansPerYear[bilan.year] = bilan;
  return bilansPerYear;
};

const mapToDomainObject = (
  response: IAPIBilanResponse[]
): IBilanFinancier[] => {
  const allBilans = response.map(mapToBilan);

  const bilansK = allBilans
    .filter((b) => b.estConsolide)
    .reduce(groupPerYear, {});

  const bilansC = allBilans
    .filter((b) => b.estComplet)
    .reduce(groupPerYear, {});

  const bilansS = allBilans
    .filter((b) => b.estSimplifie)
    .reduce(groupPerYear, {});

  const sortPerYear = (b1: IBilanFinancier, b2: IBilanFinancier) =>
    b1.year - b2.year;

  const hasBilanConsolide = Object.values(bilansK).length > 0;
  if (hasBilanConsolide) {
    return Object.values(bilansK).sort(sortPerYear);
  } else {
    const mergedBilans = Object.assign(bilansS, bilansC);
    return Object.values(mergedBilans).sort(sortPerYear);
  }
};

const mapToBilan = (financialData: IAPIBilanResponse): IBilanFinancier => {
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
    ebe,
    margeBrute: marge_brute,
    resultatNet: resultat_net,
    siren: siren,
    poidsBfrExploitationSurCa: poids_bfr_exploitation_sur_ca,
    autonomieFinanciere: autonomie_financiere,
    capaciteDeRemboursement: capacite_de_remboursement,
    ratioDeLiquidite: ratio_de_liquidite,
    tauxDEndettement: taux_d_endettement,
    type: type_bilan.toLowerCase(),
    estSimplifie: type_bilan.toLowerCase() === 's',
    estConsolide: type_bilan.toLowerCase() === 'k',
    estComplet: type_bilan.toLowerCase() === 'c',
    year: new Date(date_cloture_exercice).getFullYear(),
  };
};
