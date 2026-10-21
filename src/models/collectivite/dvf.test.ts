import { beforeEach, describe, expect, it, vi } from "vitest";
import { EAdministration } from "#/models/administrations/e-administration";
import {
  getCollectiviteDVF,
  type ICollectiviteDVF,
  type IDVFIndicateurMensuel,
} from "./dvf";

const { client, logError } = vi.hoisted(() => ({
  client: vi.fn(),
  logError: vi.fn(),
}));
vi.mock("#/clients/dvf", () => ({ clientDVF: client }));
vi.mock("#/utils/sentry", () => ({ logErrorInSentry: logError }));

beforeEach(() => {
  client.mockReset();
  logError.mockReset();
});

const parisArrondissementCodes = [
  "75101",
  "75102",
  "75103",
  "75104",
  "75105",
  "75106",
  "75107",
  "75108",
  "75109",
  "75110",
  "75111",
  "75112",
  "75113",
  "75114",
  "75115",
  "75116",
  "75117",
  "75118",
  "75119",
  "75120",
];

function month(
  mois: string,
  values: Partial<Omit<IDVFIndicateurMensuel, "mois">> = {}
): IDVFIndicateurMensuel {
  return {
    mois,
    nombreVentesMaisons: null,
    nombreVentesAppartements: null,
    nombreVentesLogements: null,
    prixMedianM2Maisons: null,
    prixMedianM2Appartements: null,
    prixMedianM2Logements: null,
    prixMedianM2LocauxIndustrielsCommerciaux: null,
    ...values,
  };
}

function response(
  codeInsee: string,
  indicateurs: IDVFIndicateurMensuel[]
): ICollectiviteDVF {
  return {
    codeInsee,
    indicateurs,
    nomCommune: `Arrondissement ${codeInsee}`,
    sirenEpci: "200054781",
  };
}

const cityCases = [
  {
    codeInsee: "75056",
    nomCommune: "Paris",
    sirenEpci: "200054781",
    arrondissementCodes: parisArrondissementCodes,
  },
  {
    codeInsee: "69123",
    nomCommune: "Lyon",
    sirenEpci: "200046977",
    arrondissementCodes: [
      "69381",
      "69382",
      "69383",
      "69384",
      "69385",
      "69386",
      "69387",
      "69388",
      "69389",
    ],
  },
  {
    codeInsee: "13055",
    nomCommune: "Marseille",
    sirenEpci: "200054807",
    arrondissementCodes: [
      "13201",
      "13202",
      "13203",
      "13204",
      "13205",
      "13206",
      "13207",
      "13208",
      "13209",
      "13210",
      "13211",
      "13212",
      "13213",
      "13214",
      "13215",
      "13216",
    ],
  },
];

describe("DVF commune fetching", () => {
  it("keeps ordinary communes on a single request", async () => {
    const data = response("87085", [
      month("2025-01", { nombreVentesLogements: 10 }),
    ]);
    client.mockResolvedValueOnce(data);

    expect(await getCollectiviteDVF("87085")).toEqual(data);
    expect(client).toHaveBeenCalledExactlyOnceWith("87085");
  });
});

describe.each(cityCases)(
  "$nomCommune DVF aggregation",
  ({ codeInsee, nomCommune, sirenEpci, arrondissementCodes }) => {
    const arrondissementResponse = (
      code: string,
      indicateurs: IDVFIndicateurMensuel[]
    ): ICollectiviteDVF => ({ ...response(code, indicateurs), sirenEpci });
    it("starts every arrondissement request in parallel and sums sales with the agreed price weights", async () => {
      const requests = new Map<
        string,
        {
          promise: Promise<ICollectiviteDVF>;
          resolve: (data: ICollectiviteDVF) => void;
        }
      >();
      for (const code of arrondissementCodes) {
        let resolve: (data: ICollectiviteDVF) => void = () => undefined;
        const promise = new Promise<ICollectiviteDVF>((complete) => {
          resolve = complete;
        });
        requests.set(code, { promise, resolve });
      }
      client.mockImplementation((code: string) => requests.get(code)?.promise);

      const result = getCollectiviteDVF(codeInsee);
      expect(client.mock.calls.map(([code]) => code)).toEqual(
        arrondissementCodes
      );

      for (const code of arrondissementCodes) {
        const values =
          code === arrondissementCodes[0]
            ? {
                nombreVentesMaisons: 2,
                prixMedianM2Maisons: 100,
                nombreVentesAppartements: 1,
                prixMedianM2Appartements: 300,
                nombreVentesLogements: 3,
                prixMedianM2Logements: 200,
                prixMedianM2LocauxIndustrielsCommerciaux: 500,
              }
            : code === arrondissementCodes[1]
              ? {
                  nombreVentesMaisons: 6,
                  prixMedianM2Maisons: 300,
                  nombreVentesAppartements: 3,
                  prixMedianM2Appartements: 700,
                  nombreVentesLogements: 9,
                  prixMedianM2Logements: 600,
                  prixMedianM2LocauxIndustrielsCommerciaux: 1500,
                }
              : {
                  nombreVentesMaisons: 0,
                  nombreVentesAppartements: 0,
                  nombreVentesLogements: 0,
                };
        requests
          .get(code)
          ?.resolve(arrondissementResponse(code, [month("2025-01", values)]));
      }

      expect(await result).toEqual({
        codeInsee,
        nomCommune,
        sirenEpci,
        prixAgregesParArrondissement: true,
        indicateurs: [
          {
            mois: "2025-01",
            nombreVentesMaisons: 8,
            prixMedianM2Maisons: 250,
            nombreVentesAppartements: 4,
            prixMedianM2Appartements: 600,
            nombreVentesLogements: 12,
            prixMedianM2Logements: 500,
            prixMedianM2LocauxIndustrielsCommerciaux: 1000,
          },
        ],
      });
      expect(client).not.toHaveBeenCalledWith(codeInsee);
    });

    it("aligns months chronologically and preserves nulls without weighting unknown or zero sales", async () => {
      client.mockImplementation((code: string) => {
        if (code === arrondissementCodes[0]) {
          return arrondissementResponse(code, [
            month("2025-02", { nombreVentesMaisons: 1 }),
            month("2025-01", {
              nombreVentesMaisons: 0,
              prixMedianM2Maisons: 9000,
              prixMedianM2Appartements: 7000,
            }),
          ]);
        }
        if (code === arrondissementCodes[1]) {
          return arrondissementResponse(code, [
            month("2025-03"),
            month("2025-01", {
              prixMedianM2Maisons: 8000,
              nombreVentesAppartements: 2,
              prixMedianM2Appartements: 1000,
            }),
          ]);
        }
        return arrondissementResponse(code, []);
      });

      const result = await getCollectiviteDVF(codeInsee);
      expect(result).toHaveProperty("indicateurs");
      if (!("indicateurs" in result)) {
        throw new Error("Expected DVF data");
      }
      expect(result.indicateurs.map(({ mois }) => mois)).toEqual([
        "2025-01",
        "2025-02",
        "2025-03",
      ]);
      expect(result.indicateurs[0]).toMatchObject({
        nombreVentesMaisons: 0,
        prixMedianM2Maisons: null,
        nombreVentesAppartements: 2,
        prixMedianM2Appartements: 1000,
        nombreVentesLogements: null,
        prixMedianM2Logements: null,
        prixMedianM2LocauxIndustrielsCommerciaux: null,
      });
      expect(result.indicateurs[1]).toMatchObject({
        nombreVentesMaisons: 1,
        prixMedianM2Maisons: null,
      });
      expect(result.indicateurs[2]).toEqual(month("2025-03"));
    });

    it("returns the standard not-found state when every arrondissement has no observations", async () => {
      client.mockImplementation((code: string) =>
        arrondissementResponse(code, [])
      );
      expect(await getCollectiviteDVF(codeInsee)).toEqual({
        administration: EAdministration.DGFIP,
        errorType: 404,
      });
    });

    it("returns the standard error rather than an incomplete total when a request fails", async () => {
      const error = new Error("Arrondissement API unavailable");
      client.mockImplementation((code: string) =>
        code === arrondissementCodes[3]
          ? Promise.reject(error)
          : Promise.resolve(
              arrondissementResponse(code, [
                month("2025-01", { nombreVentesLogements: 10 }),
              ])
            )
      );

      expect(await getCollectiviteDVF(codeInsee)).toEqual({
        administration: EAdministration.DGFIP,
        errorType: 500,
      });
      expect(client).toHaveBeenCalledTimes(arrondissementCodes.length);
      expect(logError).toHaveBeenCalledWith(
        expect.objectContaining({ cause: error, context: { codeInsee } })
      );
    });
  }
);
