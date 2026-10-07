interface IEconomieLocaleResponse<T> {
  date_mise_a_jour: string;
  donnees: T;
  source: string;
}

export interface IEffectifSalaries {
  effectif: number;
  grand_secteur_activite: string;
}

export interface IEtablissementSirene {
  lat: number | null;
  lon: number | null;
  nom: string;
  siret: string;
}

export interface IFluxOuvertureEtablissements {
  fermetures: number;
  mois: string;
  ouvertures: number;
}

export type IEffectifsSalariesResponse = IEconomieLocaleResponse<
  Record<string, IEffectifSalaries[]>
>;

export type IEtablissementsSireneResponse = IEconomieLocaleResponse<
  IEtablissementSirene[]
>;

export type IFluxOuvertureEtablissementsResponse = IEconomieLocaleResponse<
  IFluxOuvertureEtablissements[]
>;
