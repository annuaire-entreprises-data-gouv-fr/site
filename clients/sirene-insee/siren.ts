export const getUniteLegaleInsee = async (siren: string) => {
  try {
    const token = await inseeAuth();
    if (!token) {
      return undefined;
    }

    // Return a second API call
    // This one uses the token we received for authentication
    const response = await fetch(routes.sireneInsee.siren + siren, {
      headers: {
        Authorization: token.token_type + ' ' + token.access_token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status === 429) {
      throw new Error(`API INSEE for ${siren} : Too many requests`);
    }

    if (response.status === 403) {
      return {
        siren,
        statut_diffusion: 'N',
        nom_complet: 'Nom inconnu',
        page_path: siren,
      };
    }

    const uniteLegale = await response.json();
    if (!uniteLegale || !uniteLegale.uniteLegale) return undefined;
    const {
      sigleUniteLegale,
      dateCreationUniteLegale,
      periodesUniteLegale,
      dateDernierTraitementUniteLegale,
      trancheEffectifsUniteLegale,
      statutDiffusionUniteLegale,
    } = uniteLegale.uniteLegale;

    let lastChange = null,
      siege = null;

    if (periodesUniteLegale && periodesUniteLegale.length > 0) {
      lastChange = periodesUniteLegale[0];
      siege = {
        siren: siren,
        siret: siren + lastChange.nicSiegeUniteLegale,
        nic: lastChange.nicSiegeUniteLegale,
        etat_administratif_etablissement:
          lastChange.etatAdministratifUniteLegale,
        date_creation: lastChange.dateDebut,
        activite_principale: lastChange.activitePrincipaleUniteLegale,
        etablissement_siege: 'true',
        date_mise_a_jour: null,
        libelle_activite_principale: libelleFromCodeNaf(
          lastChange.activitePrincipaleUniteLegale
        ),
        is_siege: '1',
        tranche_effectif_salarie: null,
      };
    }

    return {
      siren: siren,
      etablissement_siege: siege,
      categorie_juridique: lastChange.categorieJuridiqueUniteLegale,
      etablissements: siege ? [siege] : [],
      date_creation: dateCreationUniteLegale,
      date_mise_a_jour: (dateDernierTraitementUniteLegale || '').split('T')[0],
      statut_diffusion: statutDiffusionUniteLegale,
      nom_complet: `${(
        lastChange.denominationUniteLegale || ''
      ).toLowerCase()} (${sigleUniteLegale})`,
      page_path: siren,
      tranche_effectif_salarie_entreprise: trancheEffectifsUniteLegale,
    };
  } catch (e) {
    console.log(e);
    logErrorInSentry(`API INSEE for ${siren} : ${e}`);
    return undefined;
  }
};
