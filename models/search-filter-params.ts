import { IEtatCivil } from '#models/immatriculation/rncs';

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
  sap?: string;
  type?: string;
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
      sap = '',
      type = '',
    } = query;

    // ensure dmax > dmin
    const realDmax = dmax && dmin && dmax < dmin ? dmin : dmax;
    const realDmin = dmax && dmin && dmax < dmin ? dmax : dmin;

    this.params = {
      // careful dmin determine ageMax and vice versa
      ageMax: getAge(realDmin),
      ageMin: getAge(realDmax),
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
      sap,
      type,
    };
  }

  public toJSON() {
    return { ...this.params };
  }

  public toApiURI() {
    const { cp_dep, cp_dep_type } = this.params;
    const departement = cp_dep_type === 'dep' ? cp_dep : '';
    const code_postal = cp_dep_type === 'cp' ? cp_dep : '';
    const code_commune = cp_dep_type === 'insee' ? cp_dep : '';

    return serializeParams({
      etat_administratif: this.params.etat,
      est_rge: this.params.label === 'rge',
      est_bio: this.params.label === 'bio',
      est_ess: this.params.label === 'ess',
      est_entrepreneur_spectacle: this.params.label === 'esv',
      est_association: this.params.type === 'asso',
      est_collectivite_territoriale: this.params.type === 'ct',
      est_service_public: this.params.type === 'sp',
      est_entrepreneur_individuel: this.params.type === 'ei',
      code_postal,
      code_commune,
      section_activite_principale: this.params.sap,
      nature_juridique: this.params.nature_juridique,
      activite_principale: this.params.naf,
      departement,
      prenoms_personne: this.params.fn?.trim(),
      nom_personne: this.params.n?.trim(),
      date_naissance_personne_min: this.params.dmin,
      date_naissance_personne_max: this.params.dmax,
    });
  }

  public toURI() {
    return serializeParams(this.params);
  }

  public getPersonne(): IEtatCivil {
    return {
      nom: this.params.n?.trim() || '',
      prenom: this.params.fn?.trim() || '',
      sexe: null,
      dateNaissanceFull: '',
      dateNaissancePartial: this.params.dmin || '',
      lieuNaissance: '',
      role: '',
    };
  }

  public extractFilters = () => {
    const f = {
      dirigeantFilter: {
        icon: 'humanPin',
        label: '',
        excludeParams: ['fn', 'n', 'dmin', 'dmax'],
      },
      administrativeFilter: {
        icon: 'file',
        label: '',
        excludeParams: ['sap', 'naf', 'etat', 'nature_juridique'],
      },
      structureFilter: {
        icon: 'building',
        label: '',
        excludeParams: ['type', 'label'],
      },
      localisationFilter: {
        icon: 'mapPin',
        label: '',
        excludeParams: ['cp_dep', 'cp_dep_label', 'cp_dep_type'],
      },
    };

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

    if (administrativeFilterCounter > 0) {
      const plural = administrativeFilterCounter ? 's' : '';
      f.administrativeFilter.label += ` + ${administrativeFilterCounter} filtre${plural} administratif${plural}`;
    }

    const structureLabels = {
      ess: 'Label : ESS',
      rge: 'Label : RGE',
      esv: 'Label : entrepreneur de spectacle vivant',
      ei: 'Type : Entreprise Individuelle ',
      ct: 'Type : Collectivité territoriale ',
      sp: 'Type : Service public ',
      asso: 'Type : Association ',
    };

    if (this.params.type) {
      f.structureFilter.label =
        //@ts-ignore
        structureLabels[this.params.type] || 'filtre sur le type';
    }
    if (this.params.label && this.params.type) {
      f.structureFilter.label += ' + ';
    }
    if (this.params.label) {
      f.structureFilter.label +=
        //@ts-ignore
        structureLabels[this.params.label] || 'filtre sur le label';
    }

    if (this.params.cp_dep_label) {
      f.localisationFilter.label = this.params.cp_dep_label;
    }
    return f;
  };
}

const getAge = (d: string) => {
  try {
    const ageMilliseconds = Date.now() - new Date(d).getTime();

    // this is an approximation of age
    const age = Math.floor(ageMilliseconds / 31557600000);
    if (isNaN(ageMilliseconds)) {
      return '';
    }
    return age;
  } catch {
    return '';
  }
};

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
  icon: string;
  label: string;
  excludeParams: string[];
}

export const hasDirigeantFilter = (params: IParams = {}) => {
  return params.fn || params.n || params.dmin || params.dmax;
};

export const hasSearchParam = (params: object) => {
  return Object.values(params).some((v) => v !== '');
};

export default SearchFilterParams;