import { HttpNotFound } from "#clients/exceptions";
import routes from "#clients/routes";
import constants from "#models/constants";
import type { Siren } from "#utils/helpers";
import { httpGet } from "#utils/network";

export const clientBilanGes = async (
  siren: Siren,
  page: number = 1
): Promise<IBilanGesResponse> => {
  const response = await httpGet<IBilanGesDatagouvResponse>(
    `${routes.ademe.bilanGes}?qs=siren_principal:"${siren}"&size=20`,
    {
      timeout: constants.timeout.S,
    }
  );

  if (response.results.length === 0) {
    throw new HttpNotFound(`No Bilan GES record found for siren ${siren}`);
  }

  return mapToDomainObject(response);
};

const mapToDomainObject = (
  response: IBilanGesDatagouvResponse
): IBilanGesResponse => {
  return {
    data: response.results.map((item) => ({
      id: item.id || "",
      methodeBEGES: item.methode_beges_v4v5 || "",
      datePublication: item.date_de_publication || "",
      typeStructure: item.type_de_structure || "",
      raisonSociale: item.raison_sociale || "",
      sirenPrincipal: item.siren_principal || "",
      codeAPE: item.apenaf_associe || "",
      libelle: item.libelle || "",
      nombreSalaries: item.nombre_de_salariesdagents || "",
      region: item.region || "",
      departement: item.departement || "",
      structureObligee: item.structure_obligee || false,
      modeConsolidation: item.mode_de_consolidation || "",
      anneeReporting: item.annee_de_reporting || 0,
      emissionsDirectes:
        (item.emissions_publication_p11 || 0) +
        (item.emissions_publication_p12 || 0) +
        (item.emissions_publication_p13 || 0) +
        (item.emissions_publication_p14 || 0) +
        (item.emissions_publication_p15 || 0),
      emissionsIndirectesEnergie:
        (item.emissions_publication_p21 || 0) +
        (item.emissions_publication_p22 || 0),
      autresEmissionsIndirectes:
        (item.emissions_publication_p31 || 0) +
        (item.emissions_publication_p32 || 0) +
        (item.emissions_publication_p33 || 0) +
        (item.emissions_publication_p34 || 0) +
        (item.emissions_publication_p35 || 0),
      totalEmissions:
        (item.emissions_publication_p11 || 0) +
        (item.emissions_publication_p12 || 0) +
        (item.emissions_publication_p13 || 0) +
        (item.emissions_publication_p14 || 0) +
        (item.emissions_publication_p15 || 0) +
        (item.emissions_publication_p21 || 0) +
        (item.emissions_publication_p22 || 0) +
        (item.emissions_publication_p31 || 0) +
        (item.emissions_publication_p32 || 0) +
        (item.emissions_publication_p33 || 0) +
        (item.emissions_publication_p34 || 0) +
        (item.emissions_publication_p35 || 0),
      presentationOrganisation: item.presentation_de_lorganisation || "",
      politiqueDeveloppementDurable: item.politique_developpement_durable || "",
      actionsEtMoyens: item.actions_et_moyens || "",
      objectifsPour2030: item.objectif_pour_2030 || "",
      objectifsPour2050: item.objectif_pour_2050 || "",
      lienRapportComplet: item.lien_url_vers_le_rapport_complet_du_beges || "",
      responsableSuivi: item.responsable_du_suivi || "",
      fonction: item.fonction || "",
      telephone: item.telephone || "",
      courriel: item.courriel || "",
    })),
    meta: {
      total: response.total,
      next: response.next,
    },
  };
};
