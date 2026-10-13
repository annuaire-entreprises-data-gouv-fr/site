import type { IDVFIndicateurMensuel } from "./dvf";

/**
 * Ligne brute renvoyée par https://dvf-api.data.gouv.fr/mutations/{commune}/{section}
 * Une ligne correspond à un local (ou une nature de culture) d'une disposition.
 */
export interface IDVFMutationRow {
  adresse_code_voie: string | null;
  adresse_nom_voie: string | null;
  adresse_numero: number | null;
  adresse_suffixe: string | null;
  code_commune: string;
  code_postal: string | null;
  code_type_local: string | null;
  date_mutation: string;
  id_mutation: string;
  id_parcelle: string;
  lot1_numero: string | null;
  lot1_surface_carrez: number | null;
  lot2_surface_carrez: number | null;
  lot3_surface_carrez: number | null;
  lot4_surface_carrez: number | null;
  lot5_surface_carrez: number | null;
  nature_culture: string | null;
  nature_mutation: string;
  nom_commune: string;
  nombre_lots: number | null;
  nombre_pieces_principales: number | null;
  numero_volume: string | null;
  surface_reelle_bati: number | null;
  surface_terrain: number | null;
  type_local: string | null;
  valeur_fonciere: number | null;
}

export type DVFTypeLocal = "maison" | "appartement" | "local" | "dependance";

export type DVFVenteCategorie =
  | "maison"
  | "appartement"
  | "local"
  | "mixte"
  | "dependance"
  | "terrain";

export interface IDVFLocal {
  nombrePieces: number | null;
  surfaceBati: number | null;
  surfaceCarrez: number | null;
  type: DVFTypeLocal;
}

export interface IDVFTerrain {
  nature: string | null;
  surface: number;
}

export interface IDVFVente {
  adresse: string | null;
  categorie: DVFVenteCategorie;
  /** La vente peut être comparée aux prix médians de la commune */
  comparable: boolean;
  date: string;
  id: string;
  locaux: IDVFLocal[];
  natureMutation: string;
  parcelles: string[];
  prixM2: number | null;
  surfaceBatie: number | null;
  terrains: IDVFTerrain[];
  valeurFonciere: number | null;
  /** Plusieurs biens principaux (maisons, appartements ou locaux) vendus ensemble */
  venteEnBloc: boolean;
}

export type IDVFReferencePrices = Record<
  "maison" | "appartement" | "local",
  number | null
>;

const typeLocalByCode: Record<string, DVFTypeLocal> = {
  "1": "maison",
  "2": "appartement",
  "3": "dependance",
  "4": "local",
};

const mainTypes = new Set<DVFTypeLocal>(["maison", "appartement", "local"]);

const comparableNatures = new Set([
  "Vente",
  "Vente en l'état futur d'achèvement",
]);

function getTypeLocal(row: IDVFMutationRow): DVFTypeLocal | null {
  if (row.code_type_local && typeLocalByCode[row.code_type_local]) {
    return typeLocalByCode[row.code_type_local];
  }
  return null;
}

function getSurfaceCarrez(row: IDVFMutationRow) {
  const surfaces = [
    row.lot1_surface_carrez,
    row.lot2_surface_carrez,
    row.lot3_surface_carrez,
    row.lot4_surface_carrez,
    row.lot5_surface_carrez,
  ].filter((value): value is number => typeof value === "number");

  return surfaces.length === 0
    ? null
    : surfaces.reduce((sum, value) => sum + value, 0);
}

function localSignature(row: IDVFMutationRow) {
  return [
    row.code_type_local,
    row.surface_reelle_bati,
    row.nombre_pieces_principales,
    row.lot1_numero,
  ].join("|");
}

function cultureSignature(row: IDVFMutationRow) {
  return [row.nature_culture, row.surface_terrain].join("|");
}

function formatAdresse(row: IDVFMutationRow) {
  const voie = [row.adresse_numero, row.adresse_suffixe, row.adresse_nom_voie]
    .filter((value) => value !== null && value !== "")
    .join(" ");
  if (!voie) {
    return null;
  }
  return [voie, [row.code_postal, row.nom_commune].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
}

/**
 * Le fichier DVF produit le produit cartésien des locaux et des natures de
 * culture d'une même parcelle : on ne garde les locaux que pour la première
 * nature de culture, et les cultures que pour le premier local.
 */
function aggregateParcelleRows(rows: IDVFMutationRow[]) {
  const firstCulture = cultureSignature(rows[0]);
  const firstLocal = rows.find((row) => row.code_type_local);
  const firstLocalSignature = firstLocal ? localSignature(firstLocal) : null;

  const locaux: IDVFLocal[] = rows
    .filter(
      (row) => row.code_type_local && cultureSignature(row) === firstCulture
    )
    .flatMap((row) => {
      const type = getTypeLocal(row);
      return type
        ? [
            {
              type,
              surfaceBati: row.surface_reelle_bati,
              surfaceCarrez: getSurfaceCarrez(row),
              nombrePieces: row.nombre_pieces_principales,
            },
          ]
        : [];
    });

  const terrains: IDVFTerrain[] = rows
    .filter(
      (row) =>
        typeof row.surface_terrain === "number" &&
        row.surface_terrain > 0 &&
        (firstLocalSignature === null ||
          localSignature(row) === firstLocalSignature)
    )
    .map((row) => ({
      nature: row.nature_culture,
      surface: row.surface_terrain as number,
    }));

  return { locaux, terrains };
}

function getCategorie(locaux: IDVFLocal[]): DVFVenteCategorie {
  const types = new Set(
    locaux.map(({ type }) => type).filter((type) => mainTypes.has(type))
  );
  if (types.size > 1) {
    return "mixte";
  }
  const [type] = types;
  if (type) {
    return type as DVFVenteCategorie;
  }
  return locaux.length > 0 ? "dependance" : "terrain";
}

function aggregateMutation(rows: IDVFMutationRow[]): IDVFVente {
  const [first] = rows;
  const byParcelle = new Map<string, IDVFMutationRow[]>();
  for (const row of rows) {
    const parcelleRows = byParcelle.get(row.id_parcelle) ?? [];
    parcelleRows.push(row);
    byParcelle.set(row.id_parcelle, parcelleRows);
  }

  const locaux: IDVFLocal[] = [];
  const terrains: IDVFTerrain[] = [];
  for (const parcelleRows of byParcelle.values()) {
    const aggregated = aggregateParcelleRows(parcelleRows);
    locaux.push(...aggregated.locaux);
    terrains.push(...aggregated.terrains);
  }

  const mainLocaux = locaux.filter(({ type }) => mainTypes.has(type));
  const categorie = getCategorie(locaux);
  const surfaceBatie = mainLocaux.reduce(
    (sum, { surfaceBati }) => sum + (surfaceBati ?? 0),
    0
  );
  const valeurFonciere = first.valeur_fonciere;
  const venteEnBloc = mainLocaux.length > 1;
  const prixM2 =
    valeurFonciere !== null &&
    valeurFonciere > 0 &&
    surfaceBatie > 0 &&
    categorie !== "mixte"
      ? valeurFonciere / surfaceBatie
      : null;

  return {
    id: first.id_mutation,
    date: first.date_mutation,
    natureMutation: first.nature_mutation,
    valeurFonciere,
    adresse: formatAdresse(rows.find(formatAdresse) ?? first),
    parcelles: [...byParcelle.keys()],
    locaux,
    terrains,
    categorie,
    surfaceBatie: surfaceBatie > 0 ? surfaceBatie : null,
    prixM2,
    venteEnBloc,
    comparable:
      prixM2 !== null &&
      !venteEnBloc &&
      comparableNatures.has(first.nature_mutation),
  };
}

/**
 * Regroupe les lignes DVF par mutation : les lignes partageant un id_mutation
 * décrivent les différents locaux d'une même vente (valeur foncière commune).
 */
export function aggregateDVFMutations(rows: IDVFMutationRow[]): IDVFVente[] {
  const byMutation = new Map<string, IDVFMutationRow[]>();
  for (const row of rows) {
    const mutationRows = byMutation.get(row.id_mutation) ?? [];
    mutationRows.push(row);
    byMutation.set(row.id_mutation, mutationRows);
  }

  return [...byMutation.values()]
    .map(aggregateMutation)
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function getVentesParParcelle(ventes: IDVFVente[]) {
  const byParcelle = new Map<string, IDVFVente[]>();
  for (const vente of ventes) {
    for (const parcelle of vente.parcelles) {
      const parcelleVentes = byParcelle.get(parcelle) ?? [];
      parcelleVentes.push(vente);
      byParcelle.set(parcelle, parcelleVentes);
    }
  }
  return byParcelle;
}

export function median(values: number[]) {
  if (values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

export function getReferenceCategorie(categorie: DVFVenteCategorie) {
  return categorie === "maison" ||
    categorie === "appartement" ||
    categorie === "local"
    ? categorie
    : null;
}

/** Écart relatif entre le prix au m² d'une vente et le prix de référence */
export function getEcartReference(
  vente: IDVFVente,
  references: IDVFReferencePrices | null
) {
  const categorie = getReferenceCategorie(vente.categorie);
  const reference = categorie && references?.[categorie];
  if (!(vente.comparable && vente.prixM2 && reference)) {
    return null;
  }
  return (vente.prixM2 - reference) / reference;
}

function weightedAverage(
  indicateurs: IDVFIndicateurMensuel[],
  priceKey: Extract<keyof IDVFIndicateurMensuel, `prixMedianM2${string}`>,
  countKey?: Extract<keyof IDVFIndicateurMensuel, `nombreVentes${string}`>
) {
  let total = 0;
  let totalWeight = 0;
  for (const item of indicateurs) {
    const price = item[priceKey];
    const weight = countKey ? (item[countKey] ?? 0) : 1;
    if (price === null || weight <= 0) {
      continue;
    }
    total += price * weight;
    totalWeight += weight;
  }
  return totalWeight === 0 ? null : total / totalWeight;
}

/**
 * Prix de référence de la commune : moyenne des prix médians mensuels sur les
 * douze derniers mois disponibles, pondérée par le nombre de ventes.
 */
export function getDVFReferencePrices(
  indicateurs: IDVFIndicateurMensuel[],
  monthsCount = 12
): IDVFReferencePrices {
  const recent = [...indicateurs]
    .sort((left, right) => left.mois.localeCompare(right.mois))
    .slice(-monthsCount);

  return {
    maison: weightedAverage(
      recent,
      "prixMedianM2Maisons",
      "nombreVentesMaisons"
    ),
    appartement: weightedAverage(
      recent,
      "prixMedianM2Appartements",
      "nombreVentesAppartements"
    ),
    local: weightedAverage(recent, "prixMedianM2LocauxIndustrielsCommerciaux"),
  };
}

/** Prix de référence calculés à partir des ventes chargées sur la carte */
export function getLocalReferencePrices(
  ventes: IDVFVente[]
): IDVFReferencePrices {
  const pricesFor = (categorie: DVFVenteCategorie) =>
    median(
      ventes
        .filter((vente) => vente.comparable && vente.categorie === categorie)
        .map(({ prixM2 }) => prixM2 as number)
    );
  return {
    maison: pricesFor("maison"),
    appartement: pricesFor("appartement"),
    local: pricesFor("local"),
  };
}
