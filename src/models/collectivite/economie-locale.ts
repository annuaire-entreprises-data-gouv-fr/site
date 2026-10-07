interface ICollectiviteEconomieLocaleMetadata {
  lastModified: string;
  source: string;
}

export interface ICollectiviteEffectifSalarie {
  effectif: number;
  grandSecteurActivite: string;
}

export interface ICollectiviteEtablissementSirene {
  lat: number | null;
  lon: number | null;
  nom: string;
  siret: string;
}

export interface ICollectiviteFluxEtablissementsMensuel {
  fermetures: number;
  mois: string;
  ouvertures: number;
}

export interface ICollectiviteEffectifsSalaries
  extends ICollectiviteEconomieLocaleMetadata {
  effectifsSalaries: Record<string, ICollectiviteEffectifSalarie[]>;
}

export interface ICollectiviteEtablissementsSirene
  extends ICollectiviteEconomieLocaleMetadata {
  etablissements: ICollectiviteEtablissementSirene[];
}

export interface ICollectiviteFluxOuvertureEtablissements
  extends ICollectiviteEconomieLocaleMetadata {
  fluxEtablissements: ICollectiviteFluxEtablissementsMensuel[];
}
