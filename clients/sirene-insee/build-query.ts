import { SireneSearchParams } from './export-csv';

export class SireneQueryBuilder {
  private conditions: string[] = [];

  constructor(private params: SireneSearchParams) {
    this.buildQuery(params);
  }

  build() {
    return this.conditions.join(' AND ');
  }

  private addCategoryConditions = (categories: string[]) => {
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
    const allCodes = [
      '00',
      '01',
      '02',
      '03',
      '11',
      '12',
      '21',
      '22',
      '31',
      '32',
      '41',
      '42',
      '51',
      '52',
      '53',
    ];
    const minIndex = allCodes.indexOf(
      headcount.min.toString().padStart(2, '0')
    );
    const maxIndex = allCodes.indexOf(
      headcount.max.toString().padStart(2, '0')
    );

    const rangeConditions = allCodes
      .slice(minIndex, maxIndex + 1)
      .map((code) =>
        isHq
          ? `trancheEffectifsUniteLegale:${code}`
          : `trancheEffectifsEtablissement:${code}`
      );
    this.conditions.push(`(${rangeConditions.join(' OR ')})`);
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

  private buildQuery = (params: SireneSearchParams) => {
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

    // result = addGeo(result, fichier, nomenclatureRegions);

    // result = addApet(result, fichier, nomenclatureSections);

    // // Catégorie juridique
    // if (params.legalCategory) {
    //   this.conditions.push(`categorieJuridiqueUniteLegale:${params.legalCategory}`);
    // }

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
    if (params.categories && params.categories.length > 0) {
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
      '(statutDiffusionEtablissement:O OR statutDiffusionEtablissement:M OR statutDiffusionEtablissement:P)'
    );
  };
}
