import { clientDVF } from "#/clients/dvf";
import { HttpNotFound } from "#/clients/exceptions";
import { EAdministration } from "#/models/administrations/e-administration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
} from "#/models/api-not-responding";
import { FetchRessourceException } from "#/models/exceptions";
import logErrorInSentry from "#/utils/sentry";

export interface IDVFIndicateurMensuel {
  mois: string;
  nombreVentesAppartements: number | null;
  nombreVentesLogements: number | null;
  nombreVentesMaisons: number | null;
  prixMedianM2Appartements: number | null;
  prixMedianM2LocauxIndustrielsCommerciaux: number | null;
  prixMedianM2Logements: number | null;
  prixMedianM2Maisons: number | null;
}

export interface ICollectiviteDVF {
  codeInsee: string;
  indicateurs: IDVFIndicateurMensuel[];
  nomCommune: string;
  prixAgregesParArrondissement?: boolean;
  sirenEpci: string | null;
}

const parisArrondissementCodes = Array.from({ length: 20 }, (_, index) =>
  String(75_101 + index)
);

type DVFCountKey = Extract<
  keyof IDVFIndicateurMensuel,
  `nombreVentes${string}`
>;
type DVFPriceKey = Extract<
  keyof IDVFIndicateurMensuel,
  `prixMedianM2${string}`
>;

function sumSales(indicateurs: IDVFIndicateurMensuel[], key: DVFCountKey) {
  const values = indicateurs
    .map((item) => item[key])
    .filter((value) => value !== null);
  return values.length === 0
    ? null
    : values.reduce((sum, value) => sum + value, 0);
}

function averagePrice(
  indicateurs: IDVFIndicateurMensuel[],
  priceKey: DVFPriceKey,
  countKey?: DVFCountKey
) {
  let total = 0;
  let totalWeight = 0;

  for (const item of indicateurs) {
    const price = item[priceKey];
    const weight = countKey ? item[countKey] : 1;

    if (price === null || weight === null || weight <= 0) {
      continue;
    }

    total += price * weight;
    totalWeight += weight;
  }

  return totalWeight === 0 ? null : total / totalWeight;
}

async function getParisDVF(): Promise<ICollectiviteDVF> {
  const arrondissements = await Promise.all(
    parisArrondissementCodes.map((codeInsee) => clientDVF(codeInsee))
  );
  const byMonth = new Map<string, IDVFIndicateurMensuel[]>();

  for (const arrondissement of arrondissements) {
    for (const item of arrondissement.indicateurs) {
      const indicateurs = byMonth.get(item.mois) ?? [];
      indicateurs.push(item);
      byMonth.set(item.mois, indicateurs);
    }
  }

  return {
    codeInsee: "75056",
    nomCommune: "Paris",
    sirenEpci:
      arrondissements.find((item) => item.sirenEpci !== null)?.sirenEpci ??
      null,
    prixAgregesParArrondissement: true,
    indicateurs: [...byMonth.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([mois, indicateurs]) => ({
        mois,
        nombreVentesMaisons: sumSales(indicateurs, "nombreVentesMaisons"),
        nombreVentesAppartements: sumSales(
          indicateurs,
          "nombreVentesAppartements"
        ),
        nombreVentesLogements: sumSales(indicateurs, "nombreVentesLogements"),
        prixMedianM2Maisons: averagePrice(
          indicateurs,
          "prixMedianM2Maisons",
          "nombreVentesMaisons"
        ),
        prixMedianM2Appartements: averagePrice(
          indicateurs,
          "prixMedianM2Appartements",
          "nombreVentesAppartements"
        ),
        prixMedianM2Logements: averagePrice(
          indicateurs,
          "prixMedianM2Logements",
          "nombreVentesLogements"
        ),
        prixMedianM2LocauxIndustrielsCommerciaux: averagePrice(
          indicateurs,
          "prixMedianM2LocauxIndustrielsCommerciaux"
        ),
      })),
  };
}

export const getCollectiviteDVF = async (
  codeInsee: string
): Promise<ICollectiviteDVF | IAPINotRespondingError> => {
  try {
    const dvf =
      codeInsee === "75056" ? await getParisDVF() : await clientDVF(codeInsee);

    if (dvf.indicateurs.length === 0) {
      return APINotRespondingFactory(EAdministration.DGFIP, 404);
    }

    return dvf;
  } catch (error) {
    if (error instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.DGFIP, 404);
    }

    logErrorInSentry(
      new FetchRessourceException({
        administration: EAdministration.DGFIP,
        cause: error,
        context: { codeInsee },
        ressource: "CollectiviteDVF",
      })
    );

    return APINotRespondingFactory(EAdministration.DGFIP, 500);
  }
};
