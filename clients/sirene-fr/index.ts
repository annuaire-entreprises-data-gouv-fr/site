import routes from '#clients/routes';

export interface SireneSearchParams {
  size?: {
    min: number;
    max: number;
  };
  category?: ('PME' | 'ETI' | 'GE')[];
  activity?: 'all' | 'active' | 'ceased';
  legalUnit?: 'all' | 'hq';
  legalCategory?: string;
  naf?: string;
  label?: string;
  location?: string;
  creationDate?: {
    from?: string;
    to?: string;
  };
  updateDate?: {
    from?: string;
    to?: string;
  };
}

const buildQuery = (params: SireneSearchParams): string => {
  const conditions: string[] = [];

  // // Taille de l'entreprise
  if (params.size) {
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
      params.size.min.toString().padStart(2, '0')
    );
    const maxIndex = allCodes.indexOf(
      params.size.max.toString().padStart(2, '0')
    );
    const rangeConditions = allCodes
      .slice(minIndex, maxIndex + 1)
      .map((code) => `trancheEffectifsEtablissement:${code}`);
    conditions.push(`(${rangeConditions.join(' OR ')})`);
  }

  // Catégorie d'entreprise
  if (params.category && params.category.length > 0) {
    if (params.category.length === 1) {
      conditions.push(`categorieEntreprise:${params.category[0]}`);
    } else {
      const categoryConditions = params.category.map(
        (cat) => `categorieEntreprise:${cat}`
      );
      conditions.push(`(${categoryConditions.join(' OR ')})`);
    }
  }

  // Activité
  if (params.activity === 'active') {
    conditions.push('periode(etatAdministratifEtablissement:A)');
  } else if (params.activity === 'ceased') {
    conditions.push('periode(etatAdministratifEtablissement:F)');
  }

  // Unité légale
  if (params.legalUnit === 'hq') {
    conditions.push('etablissementSiege:true');
  }

  // // Catégorie juridique
  // if (params.legalCategory) {
  //   conditions.push(`categorieJuridiqueUniteLegale:${params.legalCategory}`);
  // }

  // // Code NAF
  // if (params.naf) {
  //   conditions.push(`activitePrincipaleUniteLegale:${params.naf}`);
  // }

  // // Localisation
  // if (params.location) {
  //   conditions.push(`libelleCommuneEtablissement:${params.location}`);
  // }

  // Date de création
  if (params.creationDate?.from && params.creationDate?.to) {
    conditions.push(
      `dateCreationEtablissement:[${params.creationDate.from} TO ${params.creationDate.to}]`
    );
  } else if (params.creationDate?.from) {
    conditions.push(
      `dateCreationEtablissement:[${params.creationDate.from} TO ${
        new Date().toISOString().split('T')[0]
      }]`
    );
  } else if (params.creationDate?.to) {
    conditions.push(
      `dateCreationEtablissement:[1860-01-01 TO ${params.creationDate.to}]`
    );
  }

  // Date de mise à jour
  if (params.updateDate?.from && params.updateDate?.to) {
    conditions.push(
      `dateDernierTraitementEtablissement:[${params.updateDate.from} TO ${params.updateDate.to}]`
    );
  } else if (params.updateDate?.from) {
    conditions.push(
      `dateDernierTraitementEtablissement:[${params.updateDate.from} TO ${
        new Date().toISOString().split('T')[0]
      }]`
    );
  } else if (params.updateDate?.to) {
    conditions.push(
      `dateDernierTraitementEtablissement:[1860-01-01 TO ${params.updateDate.to}]`
    );
  }

  return conditions.join(' AND ');
};

export const clientSireneInsee = async (params: SireneSearchParams) => {
  const token = process.env.INSEE_API_KEY as string;

  const query = buildQuery(params);
  const url = `${
    routes.sireneInsee.listEtablissements
  }/siret?q=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    headers: {
      'X-INSEE-Api-Key-Integration': token,
      Accept: 'text/csv',
      'Accept-Encoding': 'gzip',
    },
  });

  return await response.text();
};

export interface ISireneInseeCount {
  header: {
    statut: number;
    message: string;
    total: number;
    debut: number;
    nombre: number;
  };
  etablissements: any[];
}

export const clientSireneInseeCount = async (params: SireneSearchParams) => {
  const token = process.env.INSEE_API_KEY as string;

  const query = buildQuery(params);
  const url = `${
    routes.sireneInsee.listEtablissements
  }/siret?q=${encodeURIComponent(query)}&nombre=0`;

  const response = await fetch(url, {
    headers: {
      'X-INSEE-Api-Key-Integration': token,
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
    },
  });

  const { header } = (await response.json()) as ISireneInseeCount;

  if (header.statut === 404) {
    return 0;
  }

  return header.nombre;
};
