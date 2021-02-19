/**
 * GET UNITE LEGALE
 */

const getUniteLegaleSireneOuverte = async (
  siren: string
): Promise<UniteLegale | undefined> => {
  if (!isSirenOrSiret(siren)) {
    throw new Error(`Ceci n'est pas un numéro SIREN valide : ${siren}`);
  }
  try {
    const response = await fetch(routes.sireneOuverte.uniteLegale + siren);
    if (response.status !== 200) {
      throw new Error(await response.text());
    }

    const result = (await response.json())[0].unite_legale;
    const uniteLegale = result[0];
    const siege = uniteLegale.etablissement_siege[0];

    if (!siege.is_siege) {
      throw new Error(`Etablissement siege is not siege : ${siren}`);
    }

    const listOfEtablissement = uniteLegale.etablissements;

    if (!listOfEtablissement || listOfEtablissement.length === 0) {
      throw new Error(`No etablissements found`);
    }

    const {
      date_creation,
      date_creation_entreprise,
      date_mise_a_jour,
      numero_tva_intra,
      date_debut_activite,
      tranche_effectif_salarie_entreprise,
    } = uniteLegale;

    const {
      statut_diffusion = null,
      nature_juridique_entreprise = null,
      nombre_etablissements,
      nom_complet = null,
      nom_url = null,
    } = siege;

    const unite_legale = {
      siren,
      numero_tva_intra,
      etablissement_siege: siege,
      categorie_juridique: nature_juridique_entreprise,
      tranche_effectif_salarie_entreprise,
      etablissements: listOfEtablissement,
      statut_diffusion,
      nombre_etablissements,
      nom_complet,
      page_path: nom_url || siren,
      date_creation,
      date_creation_entreprise,
      date_debut_activite,
      date_mise_a_jour,
    } as UniteLegale;

    return unite_legale;
  } catch (e) {
    console.log(e);
    logErrorInSentry(`API Sirene Etalab for ${siren} : ${e}`);
    return undefined;
  }
};
