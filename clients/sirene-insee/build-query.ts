import { regions } from "#utils/helpers/formatting/metadata/regions";
import { ExportCsvInput } from "app/api/export-sirene/input-validation";
import { niv1ToNiv5Mapping } from "scripts/nomenclature-d-activites-francaises/niv1ToNiv5Mapping";
import { effectifCodes } from "./constants";

export class SireneQueryBuilder {
  private conditions: string[] = [];

  constructor(params: ExportCsvInput) {
    this.buildQuery(params);
  }

  static getAvailableFields(): string[] {
    return [
      "siren",
      "nic",
      "siret",
      "statutDiffusionEtablissement",
      "dateCreationEtablissement",
      "trancheEffectifsEtablissement",
      "anneeEffectifsEtablissement",
      "activitePrincipaleRegistreMetiersEtablissement",
      "dateDernierTraitementEtablissement",
      "etablissementSiege",
      "etatAdministratifUniteLegale",
      "statutDiffusionUniteLegale",
      "unitePurgeeUniteLegale",
      "dateCreationUniteLegale",
      "categorieJuridiqueUniteLegale",
      "denominationUniteLegale",
      "sigleUniteLegale",
      "denominationUsuelle1UniteLegale",
      "denominationUsuelle2UniteLegale",
      "denominationUsuelle3UniteLegale",
      "sexeUniteLegale",
      "nomUniteLegale",
      "nomUsageUniteLegale",
      "prenom1UniteLegale",
      "prenom2UniteLegale",
      "prenom3UniteLegale",
      "prenom4UniteLegale",
      "prenomUsuelUniteLegale",
      "pseudonymeUniteLegale",
      "activitePrincipaleUniteLegale",
      "nomenclatureActivitePrincipaleUniteLegale",
      "identifiantAssociationUniteLegale",
      "economieSocialeSolidaireUniteLegale",
      "societeMissionUniteLegale",
      "trancheEffectifsUniteLegale",
      "anneeEffectifsUniteLegale",
      "nicSiegeUniteLegale",
      "dateDernierTraitementUniteLegale",
      "categorieEntreprise",
      "anneeCategorieEntreprise",
      "complementAdresseEtablissement",
      "numeroVoieEtablissement",
      "indiceRepetitionEtablissement",
      "typeVoieEtablissement",
      "libelleVoieEtablissement",
      "codePostalEtablissement",
      "libelleCommuneEtablissement",
      "libelleCommuneEtrangerEtablissement",
      "codeCommuneEtablissement",
      "codePaysEtrangerEtablissement",
      "libellePaysEtrangerEtablissement",
      "etatAdministratifEtablissement",
      "enseigne1Etablissement",
      "enseigne2Etablissement",
      "enseigne3Etablissement",
      "denominationUsuelleEtablissement",
      "activitePrincipaleEtablissement",
      "nomenclatureActivitePrincipaleEtablissement",
      "caractereEmployeurEtablissement",
      "coordonneeLambertAbscisseEtablissement",
      "coordonneeLambertOrdonneeEtablissement",
      "identifiantAdresseEtablissement",
      "dernierNumeroVoieEtablissement",
    ];
  }

  static getFieldsString(): string {
    return SireneQueryBuilder.getAvailableFields().join(",");
  }

  build() {
    return this.conditions.join(" AND ");
  }

  private addCategoryConditions = (categories: string[]) => {
    if (!categories?.length) {
      return;
    }

    const categoryConditions = categories.join(" OR ");
    this.conditions.push(`(categorieEntreprise:(${categoryConditions}))`);
  };

  private addESSConditions = (
    {
      inclure,
      inclureNo,
      inclureNonRenseigne,
    }: {
      inclure: boolean;
      inclureNo: boolean;
      inclureNonRenseigne: boolean;
    },
    type: "mission" | "ess"
  ) => {
    const field =
      type === "mission"
        ? "societeMissionUniteLegale"
        : "economieSocialeSolidaireUniteLegale";

    // Toutes les entreprises : ESS, non ESS et non-renseignées
    if (inclure && inclureNo && inclureNonRenseigne) {
      return;
    }

    if (!inclure && !inclureNo && !inclureNonRenseigne) {
      this.conditions.push(`(${field}:O AND ${field}:N)`);
      return;
    }

    if (inclureNonRenseigne && inclure) {
      this.conditions.push(`-${field}:N`);
      return;
    }

    if (inclureNonRenseigne && inclureNo) {
      this.conditions.push(`-${field}:O`);
      return;
    }

    if (inclure && inclureNo) {
      this.conditions.push(`-${field}:*`);
      return;
    }
    if (inclure) {
      this.conditions.push(`${field}:O`);
      return;
    }

    if (inclureNo) {
      this.conditions.push(`${field}:N`);
      return;
    }

    if (inclureNonRenseigne) {
      this.conditions.push(`${field}:*`);
      return;
    }
  };

  private addSirenSiretConditions = (siretsAndSirens: string[]) => {
    if (!siretsAndSirens?.length) {
      return;
    }

    const sirens = siretsAndSirens.filter((siren) => siren.length === 9);
    const sirets = siretsAndSirens.filter((siret) => siret.length === 14);
    const sirenConditions =
      sirens.length > 0 ? `siren:(${sirens.join(" OR ")})` : "";
    const siretConditions =
      sirets.length > 0 ? `siret:(${sirets.join(" OR ")})` : "";

    if (sirens.length > 0 && sirets.length > 0) {
      this.conditions.push(`(${sirenConditions} OR ${siretConditions})`);
    } else if (sirens.length > 0) {
      this.conditions.push(sirenConditions);
    } else {
      this.conditions.push(siretConditions);
    }
  };

  private addEffectifConditions = (
    headcount: { min: number; max: number },
    isHq?: boolean
  ) => {
    if (!headcount?.min || !headcount?.max) {
      return;
    }

    const minIndex = effectifCodes.indexOf(
      headcount.min.toString().padStart(2, "0")
    );
    const maxIndex = effectifCodes.indexOf(
      headcount.max.toString().padStart(2, "0")
    );

    const rangeConditions = effectifCodes
      .slice(minIndex, maxIndex + 1)
      .map((effectifCode) =>
        isHq
          ? `trancheEffectifsUniteLegale:${effectifCode}`
          : `trancheEffectifsEtablissement:${effectifCode}`
      );
    this.conditions.push(`(${rangeConditions.join(" OR ")})`);
  };

  private addLegalCategoryConditions = (legalCategories: string[]) => {
    if (!legalCategories?.length) {
      return;
    }

    const legalCategoriesConditions = legalCategories.map(
      (cat) => `categorieJuridiqueUniteLegale:${cat}`
    );
    this.conditions.push(`(${legalCategoriesConditions.join(" OR ")})`);
  };

  private addDateCreationConditions = (
    creationDate: {
      to?: string;
      from?: string;
    },
    isHq?: boolean
  ) => {
    const from = creationDate.from ? creationDate.from : "*";
    const to = creationDate.to ? creationDate.to : "*";
    this.conditions.push(
      `${
        isHq ? "dateCreationUniteLegale" : "dateCreationEtablissement"
      }:[${from} TO ${to}]`
    );
  };

  private addDateMajConditions = (
    updateDate: {
      to?: string;
      from?: string;
    },
    isHq?: boolean
  ) => {
    const from = updateDate.from ? updateDate.from : "*";
    const to = updateDate.to ? updateDate.to : "*";
    this.conditions.push(
      `${
        isHq
          ? "dateDernierTraitementUniteLegale"
          : "dateDernierTraitementEtablissement"
      }:[${from} TO ${to}]`
    );
  };

  private addLocationConditions = (location: {
    codesPostaux?: string[];
    codesInsee?: string[];
    departments?: string[];
    regions?: string[];
  }) => {
    if (
      !location.codesPostaux?.length &&
      !location.codesInsee?.length &&
      !location.departments?.length &&
      !location.regions?.length
    ) {
      return;
    }

    const allCodesCommunes = new Set<string>();
    const allCodesPostaux = new Set<string>();

    if (location.codesPostaux?.length) {
      location.codesPostaux.forEach((codePostal) => {
        allCodesPostaux.add(codePostal);
      });
    }

    if (location.codesInsee?.length) {
      location.codesInsee.forEach((codeInsee) => {
        allCodesCommunes.add(codeInsee);
      });
    }

    if (location.departments?.length) {
      location.departments.forEach((dept) => allCodesCommunes.add(`${dept}*`));
    }

    if (location.regions?.length) {
      location.regions.forEach((region) => {
        const regionData = regions.find((r) => r.code === region);
        if (regionData) {
          regionData.departments.forEach((dept) =>
            allCodesCommunes.add(`${dept.code}*`)
          );
        }
      });
    }

    const codesCommunesConditions = Array.from(allCodesCommunes).map(
      (codeCommune) => `codeCommuneEtablissement:${codeCommune}`
    );
    const codesPostauxConditions = Array.from(allCodesPostaux).map(
      (codePostal) => `codePostalEtablissement:${codePostal}`
    );

    this.conditions.push(
      `(${[...codesCommunesConditions, ...codesPostauxConditions].join(
        " OR "
      )})`
    );
  };

  private addActivityConditions = (
    naf?: string[],
    sap?: string[],
    isHq?: boolean
  ) => {
    if (!naf?.length && !sap?.length) {
      return;
    }

    const allLevels = new Set<string>();

    if (naf?.length) {
      naf.forEach((naf) => {
        allLevels.add(naf);
      });
    }

    if (sap?.length) {
      sap.forEach((sap) => {
        niv1ToNiv5Mapping[sap].forEach((naf) => {
          allLevels.add(naf);
        });
      });
    }

    const field = isHq
      ? "activitePrincipaleUniteLegale"
      : "activitePrincipaleEtablissement";

    const activityConditions = Array.from(allLevels)
      .map((activity) => `${field}:${activity}`)
      .join(" OR ");

    if (!isHq) {
      this.conditions.push(`periode(-dateFin:* AND (${activityConditions}))`);
    } else {
      this.conditions.push(`(${activityConditions})`);
    }
  };

  private buildQuery = (params: ExportCsvInput) => {
    // Etat administratif de l'établissement
    if (params.activity === "active") {
      this.conditions.push(
        "periode(-dateFin:* AND etatAdministratifEtablissement:A)"
      );
    } else if (params.activity === "ceased") {
      this.conditions.push(
        "periode(-dateFin:* AND etatAdministratifEtablissement:F)"
      );
    }

    // Type d'établissement
    if (params.legalUnit === "hq") {
      this.conditions.push("etablissementSiege:true");
    }

    // Localisation
    if (params.location) {
      this.addLocationConditions(params.location);
    }

    // Activité
    if (params.naf || params.sap) {
      this.addActivityConditions(
        params.naf,
        params.sap,
        params.legalUnit === "hq"
      );
    }

    // Catégorie juridique
    if (params.legalCategories) {
      this.addLegalCategoryConditions(params.legalCategories);
    }

    // Tranche d'effectifs
    if (params.headcount) {
      this.addEffectifConditions(params.headcount);
    }

    // Date de création
    if (params.creationDate?.from || params.creationDate?.to) {
      this.addDateCreationConditions(
        params.creationDate,
        params.legalUnit === "hq"
      );
    }

    // Date de mise à jour
    if (params.updateDate?.from || params.updateDate?.to) {
      this.addDateMajConditions(params.updateDate, params.legalUnit === "hq");
    }

    // Sirets et Sirens
    if (params.siretsAndSirens) {
      this.addSirenSiretConditions(params.siretsAndSirens);
    }

    // Catégorie d'entreprise
    if (params.categories) {
      this.addCategoryConditions(params.categories);
    }

    // Filtre ESS
    if (params.ess) {
      this.addESSConditions(params.ess, "ess");
    }

    // Filtre société à mission
    if (params.mission) {
      this.addESSConditions(params.mission, "mission");
    }

    // Retirer les établissements non diffusibles
    this.conditions.push(
      "(statutDiffusionEtablissement:O OR statutDiffusionEtablissement:P)"
    );
  };
}
