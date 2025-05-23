import { IIconsSlug } from '#components-ui/icon';
import { convertDateToAge } from '#utils/helpers';

export interface IParams {
  ageMax?: number | string;
  ageMin?: number | string;
  cp_dep_label?: string;
  cp_dep_type?: string;
  cp_dep?: string;
  dmax?: string;
  dmin?: string;
  etat?: string;
  fn?: string;
  isEmpty?: boolean;
  label?: string;
  n?: string;
  naf?: string;
  nature_juridique?: string;
  categorie_entreprise?: string;
  tranche_effectif_salarie?: string;
  sap?: string;
  type?: string;
  ca_min?: number | null;
  ca_max?: number | null;
  res_min?: number | null;
  res_max?: number | null;
}

class SearchFilterParams {
  private params: IParams;

  constructor(query: IParams = {}) {
    const {
      cp_dep = '',
      cp_dep_label = '',
      cp_dep_type = '',
      dmax = '',
      dmin = '',
      etat = '',
      fn = '',
      label = '',
      n = '',
      naf = '',
      nature_juridique = '',
      tranche_effectif_salarie = '',
      categorie_entreprise = '',
      sap = '',
      type = '',
      ca_min = null,
      ca_max = null,
      res_min = null,
      res_max = null,
    } = query;

    // ensure dmax > dmin
    const realDmax = dmax && dmin && dmax < dmin ? dmin : dmax;
    const realDmin = dmax && dmin && dmax < dmin ? dmax : dmin;

    this.params = {
      // careful dmin determine ageMax and vice versa
      ageMax: convertDateToAge(realDmin),
      ageMin: convertDateToAge(realDmax),
      cp_dep_label,
      cp_dep_type,
      cp_dep,
      dmax: realDmax,
      dmin: realDmin,
      etat,
      fn,
      label,
      n,
      naf,
      nature_juridique,
      tranche_effectif_salarie,
      categorie_entreprise,
      sap,
      type,
      ca_min,
      ca_max,
      res_min,
      res_max,
    };
  }

  public toJSON() {
    return { ...this.params };
  }

  public toApiURI() {
    const { cp_dep, cp_dep_type, ca_max, ca_min } = this.params;
    const departement = cp_dep_type === 'dep' ? cp_dep : '';
    const region = cp_dep_type === 'reg' ? cp_dep : '';
    const code_postal = cp_dep_type === 'cp' ? cp_dep : '';
    const epci = cp_dep_type === 'epci' ? cp_dep : '';
    const code_commune = cp_dep_type === 'insee' ? cp_dep : '';

    const labels = this.params.label ? this.params.label.split(',') : [];

    return serializeParams({
      etat_administratif: this.params.etat,
      est_rge: labels.includes('rge'),
      est_bio: labels.includes('bio'),
      egapro_renseignee: labels.includes('egapro'),
      est_ess: labels.includes('ess'),
      est_organisme_formation: labels.includes('of'),
      est_qualiopi: labels.includes('qualiopi'),
      est_entrepreneur_spectacle: labels.includes('esv'),
      est_societe_mission: labels.includes('sm'),
      est_siae: labels.includes('siae'),
      est_achats_responsables: labels.includes('achats_responsables'),
      est_patrimoine_vivant: labels.includes('patrimoine_vivant'),
      est_association: this.params.type === 'asso',
      est_collectivite_territoriale: this.params.type === 'ct',
      est_service_public: this.params.type === 'sp',
      est_entrepreneur_individuel: this.params.type === 'ei',
      section_activite_principale: this.params.sap,
      categorie_entreprise: this.params.categorie_entreprise,
      nature_juridique: this.params.nature_juridique,
      tranche_effectif_salarie: this.params.tranche_effectif_salarie,
      activite_principale: this.params.naf,
      departement,
      region,
      code_postal,
      epci,
      code_commune,
      prenoms_personne: this.params.fn?.trim(),
      nom_personne: this.params.n?.trim(),
      date_naissance_personne_min: this.params.dmin,
      date_naissance_personne_max: this.params.dmax,
      ca_max,
      ca_min,
      resultat_net_max: this.params.res_max,
      resultat_net_min: this.params.res_min,
    });
  }

  public extractFilters = () => {
    const f = {
      dirigeantFilter: {
        icon: 'user',
        label: '',
        excludeParams: ['fn', 'n', 'dmin', 'dmax'],
      },
      administrativeFilter: {
        icon: 'file',
        label: '',
        excludeParams: [
          'sap',
          'naf',
          'etat',
          'nature_juridique',
          'tranche_effectif_salarie',
          'categorie_entreprise',
        ],
      },
      structureFilter: {
        icon: 'building',
        label: '',
        excludeParams: ['type', 'label'],
      },
      financeFilter: {
        icon: 'moneyCircle',
        label: '',
        excludeParams: ['ca_min', 'ca_max', 'res_min', 'res_max'],
      },
      localisationFilter: {
        icon: 'mapPin',
        label: '',
        excludeParams: ['cp_dep', 'cp_dep_label', 'cp_dep_type'],
      },
    } as { [key: string]: ISearchFilter };

    if (hasDirigeantFilter(this.params)) {
      let labelAge = '';

      if (this.params.dmin && this.params.dmax) {
        labelAge = `entre ${this.params.ageMin} et ${this.params.ageMax} ans`;
      } else if (this.params.dmin && !this.params.dmax) {
        labelAge = `moins de ${this.params.ageMax} ans`;
      } else if (!this.params.dmin && this.params.dmax) {
        labelAge = `plus de ${this.params.ageMin} ans`;
      }

      const labelName = `${this.params.fn || ''}${
        this.params.n ? ` ${this.params.n}` : ''
      }`;
      f.dirigeantFilter.label = `${labelName}${
        labelAge && labelName && ', '
      }${labelAge}`;
    }

    if (this.params.etat) {
      f.administrativeFilter.label = `Etat : ${
        this.params.etat === 'A' ? 'en activité' : 'cessée'
      }`;
    }

    let administrativeFilterCounter = 0;
    if (this.params.sap) {
      administrativeFilterCounter += 1;
    }
    if (this.params.naf) {
      administrativeFilterCounter += 1;
    }
    if (this.params.nature_juridique) {
      administrativeFilterCounter += 1;
    }
    if (this.params.categorie_entreprise) {
      administrativeFilterCounter += 1;
    }
    if (this.params.tranche_effectif_salarie) {
      administrativeFilterCounter += 1;
    }

    if (administrativeFilterCounter > 0) {
      const plural = administrativeFilterCounter ? 's' : '';
      f.administrativeFilter.label += ` + ${administrativeFilterCounter} filtre${plural} administratif${plural}`;
    }

    const structureLabels: Record<string, string> = {
      ess: 'Qualité : ESS',
      rge: 'Certifié : RGE',
      esv: 'Label : Entrepreneur de spectacle vivant',
      bio: 'Certifié : Professionnels du bio',
      egapro: 'Label : Égalité professionnelle',
      qualiopi: 'Certifié : Qualiopi',
      sm: 'Qualité : Société à mission',
      siae: 'Qualité : Entreprise Inclusive',
      of: 'Label : Organisme de formation',
      ei: 'Type : Entreprise Individuelle ',
      ct: 'Type : Collectivité territoriale ',
      sp: 'Type : Administration',
      asso: 'Type : Association ',
      achats_responsables: 'Label : Achats Responsables',
      patrimoine_vivant: 'Label : Entreprise du Patrimoine Vivant',
    };

    if (this.params.type) {
      f.structureFilter.label =
        structureLabels[this.params.type] || 'filtre sur le type';
    }

    const labels = this.params.label ? this.params.label.split(',') : [];
    if (labels.length > 0) {
      const labelTexts = labels.map(
        (label) => structureLabels[label] || 'filtre sur le label'
      );
      if (f.structureFilter.label) {
        f.structureFilter.label += ' + ';
      }
      f.structureFilter.label += labelTexts.join(' + ');
    }

    if (this.params.cp_dep_label) {
      f.localisationFilter.label = this.params.cp_dep_label;
    }

    if (
      this.params.ca_max ||
      this.params.ca_min ||
      this.params.res_max ||
      this.params.res_min
    ) {
      f.financeFilter.label = 'Filtre financier';
    }
    return f;
  };
}

const serializeParams = (
  params: IParams | object,
  excludeParams: string[] = []
) => {
  return Object.entries(params).reduce((uri, [key, value]) => {
    if (!!value && excludeParams.indexOf(key) === -1) {
      uri += `&${key}=${encodeURIComponent(value)}`;
    }
    return uri;
  }, '');
};

export const buildSearchQuery = (
  searchTerm: string,
  params: IParams | object,
  excludeParams: string[] = []
) => {
  return `?terme=${encodeURIComponent(searchTerm)}${serializeParams(
    params,
    excludeParams
  )}`;
};

export interface ISearchFilter {
  icon: IIconsSlug;
  label: string;
  excludeParams: string[];
}

export const hasDirigeantFilter = (params: IParams = {}) => {
  return params.fn || params.n || params.dmin || params.dmax;
};

export const hasSearchParam = (params: object) => {
  return Object.values(params).some((v) => !!v);
};

export default SearchFilterParams;
