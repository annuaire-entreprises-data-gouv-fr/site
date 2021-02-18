import { libelleFromCodeNaf } from '../utils/helper';
import logErrorInSentry from '../utils/sentry';
import routes from './routes';

/**
 * API SIRENE by INSEE
 *
 * This route calls the official INSEE API, that has several limitations :
 * instable + not many concurrent request allowed.
 *
 * The idea is to only call it when the Etalab SIRENE does not answer :
 * - API Etalab is down
 * - requested company is non-diffusible
 * - requested company is very recent and API Etalab is not yet up to dat
 * - requested company does not exist
 *
 * IN all three first cases, API SIRENE by INSEE can answer, and we map the answer to the UniteLegale type
 *
 */

const inseeAuth = async () => {
  const clientId = process.env.INSEE_CLIENT_ID;
  const clientSecret = process.env.INSEE_CLIENT_SECRET;
  const response = await fetch(routes.sireneInsee.auth, {
    method: 'POST',
    body:
      'grant_type=client_credentials&client_id=' +
      clientId +
      '&client_secret=' +
      clientSecret,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  try {
    return response.json();
  } catch (e) {
    logErrorInSentry(response.text());
    return undefined;
  }
};

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
