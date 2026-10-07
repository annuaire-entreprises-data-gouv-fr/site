import routes from "#/clients/routes";
import type {
  ICollectiviteDVF,
  IDVFIndicateurMensuel,
} from "#/models/collectivite/dvf";
import { httpGet } from "#/utils/network";
import type { IDVFResponse } from "./types";

export const clientDVF = async (
  codeInsee: string
): Promise<ICollectiviteDVF> => {
  const response = await httpGet<IDVFResponse>(routes.dvf.commune(codeInsee));

  return mapToDomainObject(response, codeInsee);
};

const normalizeCount = (value: number | null): number | null =>
  value !== null && Number.isFinite(value) && value >= 0 ? value : null;

const normalizePrice = (value: number | null): number | null =>
  value !== null && Number.isFinite(value) && value > 0 ? value : null;

const mapToDomainObject = (
  response: IDVFResponse,
  codeInsee: string
): ICollectiviteDVF => {
  const rows = response.data
    .filter(
      (row) =>
        row.c === codeInsee &&
        row.l === "commune" &&
        /^\d{4}-(0[1-9]|1[0-2])$/.test(row.d)
    )
    .sort((left, right) => left.d.localeCompare(right.d));
  const latest = rows.at(-1);

  return {
    codeInsee,
    nomCommune: latest?.n ?? "",
    sirenEpci: latest?.p ?? null,
    indicateurs: rows.map(
      (row): IDVFIndicateurMensuel => ({
        mois: row.d,
        nombreVentesMaisons: normalizeCount(row.m),
        prixMedianM2Maisons: normalizePrice(row.m_m),
        nombreVentesAppartements: normalizeCount(row.a),
        prixMedianM2Appartements: normalizePrice(row.m_a),
        nombreVentesLogements: normalizeCount(row.am),
        prixMedianM2Logements: normalizePrice(row.m_am),
        prixMedianM2LocauxIndustrielsCommerciaux: normalizePrice(row.m_l),
      })
    ),
  };
};
