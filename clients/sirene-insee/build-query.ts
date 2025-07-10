import { regions } from '#utils/helpers/formatting/metadata/regions';
import { ExportCsvInput } from 'app/api/export-csv/input-validation';
import { niv1ToNiv5Mapping } from 'scripts/nomenclature-d-activites-francaises/niv1ToNiv5Mapping';
import { effectifCodes } from './constants';

export class SireneQueryBuilder {
  private conditions: string[] = [];

  constructor(params: ExportCsvInput) {
    this.buildQuery(params);
  }

  build() {
    return this.conditions.join(' AND ');
  }

  private addCategoryConditions = (categories: string[]) => {
    if (!categories?.length) {
      return;
    }

    const categoryConditions = categories.join(' OR ');
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
    type: 'mission' | 'ess'
  ) => {
    const field =
      type === 'mission'
        ? 'societeMissionUniteLegale'
        : 'economieSocialeSolidaireUniteLegale';

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
      sirens.length > 0 ? `siren:(${sirens.join(' OR ')})` : '';
    const siretConditions =
      sirets.length > 0 ? `siret:(${sirets.join(' OR ')})` : '';

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
      headcount.min.toString().padStart(2, '0')
    );
    const maxIndex = effectifCodes.indexOf(
      headcount.max.toString().padStart(2, '0')
    );

    const rangeConditions = effectifCodes
      .slice(minIndex, maxIndex + 1)
      .map((effectifCode) =>
        isHq
          ? `trancheEffectifsUniteLegale:${effectifCode}`
          : `trancheEffectifsEtablissement:${effectifCode}`
      );
    this.conditions.push(`(${rangeConditions.join(' OR ')})`);
  };

  private addLegalCategoryConditions = (legalCategories: string[]) => {
    if (!legalCategories?.length) {
      return;
    }

    const legalCategoriesConditions = legalCategories.map(
      (cat) => `categorieJuridiqueUniteLegale:${cat}`
    );
    this.conditions.push(`(${legalCategoriesConditions.join(' OR ')})`);
  };

  private addDateCreationConditions = (
    creationDate: {
      to?: string;
      from?: string;
    },
    isHq?: boolean
  ) => {
    const from = creationDate.from ? creationDate.from : '*';
    const to = creationDate.to ? creationDate.to : '*';
    this.conditions.push(
      `${
        isHq ? 'dateCreationUniteLegale' : 'dateCreationEtablissement'
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
    const from = updateDate.from ? updateDate.from : '*';
    const to = updateDate.to ? updateDate.to : '*';
    this.conditions.push(
      `${
        isHq
          ? 'dateDernierTraitementUniteLegale'
          : 'dateDernierTraitementEtablissement'
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

    // Add codes postaux
    if (location.codesPostaux?.length) {
      location.codesPostaux.forEach((codePostal) => {
        allCodesPostaux.add(codePostal);
      });
    }

    // Add codes insee
    if (location.codesInsee?.length) {
      location.codesInsee.forEach((codeInsee) => {
        allCodesCommunes.add(codeInsee);
      });
    }

    // Add departments with wildcard
    if (location.departments?.length) {
      location.departments.forEach((dept) => allCodesCommunes.add(`${dept}*`));
    }

    // Add regions by expanding to their departments with wildcard
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
        ' OR '
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

    // Add sous-classes with dot after 2nd character

    // Add groupes with dot after 2nd character and wildcard
    if (naf?.length) {
      naf.forEach((naf) => {
        allLevels.add(naf);
      });
    }

    // Add sections by expanding to their divisions with wildcard
    if (sap?.length) {
      sap.forEach((sap) => {
        niv1ToNiv5Mapping[sap].forEach((naf) => {
          allLevels.add(naf);
        });
      });
    }

    // If we're looking for headquarters, use activitePrincipaleUniteLegale instead
    const field = isHq
      ? 'activitePrincipaleUniteLegale'
      : 'activitePrincipaleEtablissement';

    const activityConditions = Array.from(allLevels)
      .map((activity) => `${field}:${activity}`)
      .join(' OR ');

    if (!isHq) {
      // Add period condition for non-headquarters
      this.conditions.push(`periode(-dateFin:* AND (${activityConditions}))`);
    } else {
      this.conditions.push(`(${activityConditions})`);
    }
  };

  private buildQuery = (params: ExportCsvInput) => {
    // Etat administratif de l'établissement
    // Ligne 668
    if (params.activity === 'active') {
      this.conditions.push(
        'periode(-dateFin:* AND etatAdministratifEtablissement:A)'
      );
    } else if (params.activity === 'ceased') {
      this.conditions.push(
        'periode(-dateFin:* AND etatAdministratifEtablissement:F)'
      );
    }

    // Type d'établissement
    // Ligne 684
    if (params.legalUnit === 'hq') {
      this.conditions.push('etablissementSiege:true');
    }

    // Localisation
    // Ligne 982
    if (params.location) {
      this.addLocationConditions(params.location);
    }

    // Activité
    if (params.naf || params.sap) {
      this.addActivityConditions(
        params.naf,
        params.sap,
        params.legalUnit === 'hq'
      );
    }

    // Catégorie juridique
    // Ligne 955
    if (params.legalCategories) {
      this.addLegalCategoryConditions(params.legalCategories);
    }

    // Tranche d'effectifs
    // Ligne 928
    if (params.headcount) {
      this.addEffectifConditions(params.headcount);
    }

    // Date de création
    // Ligne 891
    if (params.creationDate?.from || params.creationDate?.to) {
      this.addDateCreationConditions(
        params.creationDate,
        params.legalUnit === 'hq'
      );
    }

    // Date de mise à jour
    // Ligne 861
    if (params.updateDate?.from || params.updateDate?.to) {
      this.addDateMajConditions(params.updateDate, params.legalUnit === 'hq');
    }

    // Sirets et Sirens
    // Ligne 808
    if (params.siretsAndSirens) {
      this.addSirenSiretConditions(params.siretsAndSirens);
    }

    // Catégorie d'entreprise
    // Ligne 784
    if (params.categories) {
      this.addCategoryConditions(params.categories);
    }

    // Filtre ESS
    // Ligne 744
    if (params.ess) {
      this.addESSConditions(params.ess, 'ess');
    }

    // Filtre société à mission
    // Ligne 744
    if (params.mission) {
      this.addESSConditions(params.mission, 'mission');
    }

    // Retirer les établissements non diffusibles
    // Ligne 715
    this.conditions.push(
      '(statutDiffusionEtablissement:O OR statutDiffusionEtablissement:P)'
    );
  };
}
