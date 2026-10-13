import { describe, expect, it } from "vitest";
import type { IDVFIndicateurMensuel } from "./dvf";
import {
  aggregateDVFMutations,
  getDVFReferencePrices,
  getEcartReference,
  getVentesParParcelle,
  type IDVFMutationRow,
  median,
} from "./dvf-mutations";

function row(overrides: Partial<IDVFMutationRow>): IDVFMutationRow {
  return {
    adresse_code_voie: "4150",
    adresse_nom_voie: "RUE PIERRE LEROUX",
    adresse_numero: 20,
    adresse_suffixe: null,
    code_commune: "87085",
    code_postal: "87000",
    code_type_local: null,
    date_mutation: "2025-12-10",
    id_mutation: "2025-1",
    id_parcelle: "87085000DE0160",
    lot1_numero: null,
    lot1_surface_carrez: null,
    lot2_surface_carrez: null,
    lot3_surface_carrez: null,
    lot4_surface_carrez: null,
    lot5_surface_carrez: null,
    nature_culture: null,
    nature_mutation: "Vente",
    nom_commune: "Limoges",
    nombre_lots: 1,
    nombre_pieces_principales: null,
    numero_volume: null,
    surface_reelle_bati: null,
    surface_terrain: null,
    type_local: null,
    valeur_fonciere: 236_000,
    ...overrides,
  };
}

const appartement = {
  code_type_local: "2",
  type_local: "Appartement",
} as const;
const dependance = { code_type_local: "3", type_local: "Dépendance" } as const;
const maison = { code_type_local: "1", type_local: "Maison" } as const;

describe("aggregateDVFMutations", () => {
  it("groups the lots of a mutation into a single sale", () => {
    const [vente, ...others] = aggregateDVFMutations([
      row({ ...dependance, lot1_numero: "863" }),
      row({
        ...appartement,
        lot1_numero: "3107",
        lot1_surface_carrez: 83.03,
        nombre_pieces_principales: 4,
        surface_reelle_bati: 83,
      }),
      row({ ...dependance, lot1_numero: "874" }),
    ]);

    expect(others).toHaveLength(0);
    expect(vente).toMatchObject({
      adresse: "20 RUE PIERRE LEROUX, 87000 Limoges",
      categorie: "appartement",
      comparable: true,
      parcelles: ["87085000DE0160"],
      surfaceBatie: 83,
      valeurFonciere: 236_000,
      venteEnBloc: false,
    });
    expect(vente.locaux).toHaveLength(3);
    expect(vente.prixM2).toBeCloseTo(236_000 / 83);
  });

  it("removes the duplicates produced by several land cultures", () => {
    const [vente] = aggregateDVFMutations([
      row({
        ...maison,
        surface_reelle_bati: 100,
        nature_culture: "sols",
        surface_terrain: 300,
      }),
      row({
        ...maison,
        surface_reelle_bati: 100,
        nature_culture: "jardins",
        surface_terrain: 500,
      }),
      row({ ...dependance, nature_culture: "sols", surface_terrain: 300 }),
      row({ ...dependance, nature_culture: "jardins", surface_terrain: 500 }),
    ]);

    expect(vente.locaux.map(({ type }) => type)).toEqual([
      "maison",
      "dependance",
    ]);
    expect(vente.terrains).toEqual([
      { nature: "sols", surface: 300 },
      { nature: "jardins", surface: 500 },
    ]);
    expect(vente.prixM2).toBe(2360);
  });

  it("flags bulk and mixed sales as not comparable", () => {
    const ventes = aggregateDVFMutations([
      row({ ...appartement, id_mutation: "bloc", surface_reelle_bati: 30 }),
      row({ ...appartement, id_mutation: "bloc", surface_reelle_bati: 30 }),
      row({ ...appartement, id_mutation: "mixte", surface_reelle_bati: 30 }),
      row({
        code_type_local: "4",
        id_mutation: "mixte",
        surface_reelle_bati: 50,
      }),
    ]);
    const bloc = ventes.find(({ id }) => id === "bloc");
    const mixte = ventes.find(({ id }) => id === "mixte");

    expect(bloc).toMatchObject({
      categorie: "appartement",
      comparable: false,
      venteEnBloc: true,
    });
    expect(bloc?.prixM2).toBeCloseTo(236_000 / 60);
    expect(mixte).toMatchObject({ categorie: "mixte", prixM2: null });
  });

  it("keeps every parcel of a sale and sorts sales by date", () => {
    const ventes = aggregateDVFMutations([
      row({ id_mutation: "old", date_mutation: "2021-01-05" }),
      row({ id_mutation: "new", id_parcelle: "87085000DE0001" }),
      row({ id_mutation: "new", id_parcelle: "87085000DE0002" }),
    ]);

    expect(ventes.map(({ id }) => id)).toEqual(["new", "old"]);
    expect(ventes[0]).toMatchObject({
      categorie: "terrain",
      parcelles: ["87085000DE0001", "87085000DE0002"],
    });
    expect(getVentesParParcelle(ventes).get("87085000DE0002")).toEqual([
      ventes[0],
    ]);
  });
});

describe("references", () => {
  const indicateur = (
    mois: string,
    prixMaisons: number | null,
    ventesMaisons: number | null
  ): IDVFIndicateurMensuel => ({
    mois,
    nombreVentesAppartements: null,
    nombreVentesLogements: null,
    nombreVentesMaisons: ventesMaisons,
    prixMedianM2Appartements: null,
    prixMedianM2LocauxIndustrielsCommerciaux: null,
    prixMedianM2Logements: null,
    prixMedianM2Maisons: prixMaisons,
  });

  it("weights the latest monthly medians by sales", () => {
    const references = getDVFReferencePrices(
      [
        indicateur("2024-03", 1000, 1),
        indicateur("2024-01", 9999, 50),
        indicateur("2024-02", 2000, 3),
      ],
      2
    );

    expect(references).toEqual({
      appartement: null,
      local: null,
      maison: 1750,
    });
  });

  it("computes the gap between a sale and the reference", () => {
    const [vente] = aggregateDVFMutations([
      row({ ...maison, surface_reelle_bati: 100 }),
    ]);

    expect(
      getEcartReference(vente, { appartement: null, local: null, maison: 2000 })
    ).toBeCloseTo(0.18);
    expect(getEcartReference(vente, null)).toBeNull();
    expect(median([3, 1, 2, 10])).toBe(2.5);
  });
});
