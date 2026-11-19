import legacySnapshot from "./recherche-entreprise/search-908595879.json" with {
  type: "json",
};

// Synthetic Recherche Entreprises responses for diffusion cases missing from
// the recorded snapshots. Supply a full street address so masking is observable.
function company(
  siret: string,
  name: string,
  natureJuridique: string,
  status: "O" | "P" = "O"
) {
  const siren = siret.slice(0, 9);
  const siege = {
    siret,
    est_siege: true,
    etat_administratif: "A",
    statut_diffusion_etablissement: status,
    adresse: "12 RUE DES ESSAIS 69003 LYON",
    libelle_commune: "LYON",
    code_postal: "69003",
    liste_enseignes: ["ENSEIGNE TEMOIN"],
  };
  return {
    siren,
    siege,
    nom_complet: name,
    nature_juridique: natureJuridique,
    statut_diffusion: status,
    etat_administratif: "A",
    activite_principale: "70.21Z",
    date_mise_a_jour_insee: "2026-01-01",
    nombre_etablissements: 1,
    nombre_etablissements_ouverts: 1,
    matching_etablissements: [siege],
    dirigeants: [
      {
        nom: "RECHERCHE",
        prenoms: "CAMILLE",
        qualite: "Gérant",
        type_dirigeant: "personne physique",
        date_de_naissance: "1990-01",
      },
    ],
  };
}

function withPartiallyDiffusibleBranch(
  result: ReturnType<typeof company>,
  branchSiret: string
) {
  const branch = {
    ...result.siege,
    siret: branchSiret,
    adresse: "35 RUE PRIVEE 75001 PARIS",
    libelle_commune: "PARIS",
    code_postal: "75001",
    est_siege: false,
    statut_diffusion_etablissement: "P",
  };
  return {
    ...result,
    nombre_etablissements: 2,
    nombre_etablissements_ouverts: 2,
    etablissements: [result.siege, branch],
    matching_etablissements: [result.siege, branch],
  };
}

const [legacyCompany] = legacySnapshot.result.results;
const companies = [
  { ...legacyCompany, matching_etablissements: [legacyCompany.siege] },
  withPartiallyDiffusibleBranch(
    company("99000006900015", "SOCIETE MULTISITE", "5710"),
    "99000006900023"
  ),
  withPartiallyDiffusibleBranch(
    company("99000001000019", "SOCIETE TEMOIN", "5710"),
    "99000001000027"
  ),
  company("99000002800011", "EI HISTORIQUE", "1000"),
  company("99000003600014", "EI RECENTE", "1000"),
  company("99000004400018", "SOCIETE PARTIELLE", "5710", "P"),
];

export const strictSiren = "990000051";

export function diffusionSearchResponse(query: string | null) {
  if (query === legacyCompany.siren) {
    return null; // Use the original SIREN snapshot.
  }
  const results =
    query === "diffusion-temoin"
      ? companies
      : companies.flatMap((result) => {
          if (query === result.siren) {
            return [result];
          }
          const matches = result.matching_etablissements.filter(
            (e) => e.siret === query
          );
          return matches.length
            ? [{ ...result, matching_etablissements: matches }]
            : [];
        });
  if (!results.length && query !== strictSiren) {
    return null;
  }
  return {
    results,
    total_results: results.length,
    page: 1,
    per_page: 10,
    total_pages: results.length ? 1 : 0,
  };
}
