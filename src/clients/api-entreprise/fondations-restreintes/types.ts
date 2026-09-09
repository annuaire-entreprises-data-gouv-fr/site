import type { IAPIEntrepriseResponse } from "../client.server";

/** @see https://entreprise.api.gouv.fr/open-api-without-deprecated-paths.yml */
export type IAPIEntrepriseFondationsRestreintes = IAPIEntrepriseResponse<{
  identifiants: {
    rnf: string;
    siren: string | null;
    siret_siege: string | null;
  };
  identite: {
    service_instructeur: {
      code: string | null;
      libelle: string | null;
    } | null;
    type_fondation: "FRUP" | "FE" | "FDD";
    nom: string;
    etat: string;
    date_effet_etat: string | null;
    date_creation: string | null;
    duree_determinee: boolean | null;
    date_terme: string | null;
    cloture_exercice: {
      mois: number;
      jour: number;
    } | null;
    adresse_siege: {
      adresse_complete: string | null;
      complement: string | null;
      numero_voie: string | null;
      type_voie: string | null;
      libelle_voie: string | null;
      distribution: string | null;
      code_insee: string | null;
      code_postal: string | null;
      commune: string | null;
      pays: string | null;
    };
    courriel: string | null;
    telephone: string | null;
  };
  activites: {
    objet: string;
    domaines_interet_general: string[];
    activite_internationale_prevue_par_statuts: boolean | null;
  };
  dirigeants: Array<{
    nom?: string | null;
    prenom?: string | null;
    fonction?: string | null;
    qualite?: string | null;
    date_naissance?: string | null;
    nationalite?: string | null;
    pays_residence?: string | null;
    profession?: string | null;
    date_entree_fonction?: string | null;
    date_sortie_fonction?: string | null;
    fondateur?: boolean | null;
    adresse_domiciliation?: {
      adresse_complete?: string | null;
      complement?: string | null;
      numero_voie?: string | null;
      type_voie?: string | null;
      libelle_voie?: string | null;
      distribution?: string | null;
      code_insee?: string | null;
      code_postal?: string | null;
      commune?: string | null;
      pays?: string | null;
    };
    personne_morale?: {
      type?: string | null;
      identifiant?: string | null;
      nom?: string | null;
      pays?: string | null;
    } | null;
  }>;
  filiation: Array<{
    type_operation?: "Transformation" | "Fusion" | "Scission";
    identifiant?: string | null;
  }>;
  situation_financiere: {
    annees_subventions_publiques: number[];
    annees_appel_generosite_publique: number[];
    annees_financements_etrangers: number[];
  };
  conformite_comptable: {
    etat_transmission_comptes: "En règle" | "En défaut";
    annees_exercices_comptables_transmis: number[];
  };
  documents: Array<{
    id?: string;
    type?:
      | "Statuts"
      | "Comptes"
      | "Rapport d'activité"
      | "Procès verbal"
      | "Règlement intérieur"
      | "Acte notarié lié à une libéralité"
      | "Acte d'autorisation ou acte de non opposition"
      | "Courrier adressé par l'administration"
      | "Mise en demeure"
      | "Suspension"
      | "Décision de retrait / dissolution"
      | "Jugement de dissolution judiciaire";
    nom_original?: string | null;
    type_mime?: string | null;
    date_depot?: string | null;
  }>;
}>;
