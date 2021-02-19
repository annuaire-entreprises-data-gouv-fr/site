export const getEtablissementInsee = async (siret: string) => {
  try {
    const token = await inseeAuth();
    if (!token) {
      return undefined;
    }

    // Return a second API call
    // This one uses the token we received for authentication
    const response = await fetch(routes.sireneInsee.siret + siret, {
      headers: {
        Authorization: token.token_type + ' ' + token.access_token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status === 429) {
      throw new Error(`Too many requests`);
    }

    if (response.status === 403) {
      return {
        siret,
        siren: siret.slice(0, 9),
        statut_diffusion: 'N',
        nom_complet: 'Nom inconnu',
        page_path: siret,
      };
    }

    const etablissement = await response.json();
    if (!etablissement || !etablissement.etablissement) return undefined;

    console.log(etablissement);

    const {
      siren,
      nic,
      etablissementSiege,
      statutDiffusionEtablissement,
      trancheEffectifsEtablissement,
      dateCreationEtablissement,
      dateDernierTraitementEtablissement,
      activitePrincipaleRegistreMetiersEtablissement,
    } = etablissement.etablissement;

    return {
      enseigne: null,
      siren,
      siret,
      nic,
      date_creation: dateCreationEtablissement,
      geo_adresse: null,
      etablissement_siege: activitePrincipaleRegistreMetiersEtablissement,
      activite_principale: activitePrincipaleRegistreMetiersEtablissement,
      date_mise_a_jour: dateDernierTraitementEtablissement,
      date_debut_activite: null,
      libelle_activite_principale: activitePrincipaleRegistreMetiersEtablissement,
      is_siege: etablissementSiege ? '1' : null,
      tranche_effectif_salarie: trancheEffectifsEtablissement,
      latitude: null,
      longitude: null,
      statut_diffusion: statutDiffusionEtablissement,
    };
  } catch (e) {
    console.log(e);
    logErrorInSentry(`API INSEE for ${siret} : ${e}`);
    return undefined;
  }
};
