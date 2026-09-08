import type { IAPIEntrepriseResponse } from "../client.server";

/**
 * Données fondations (SIAF), including restricted information.
 * @see https://entreprise.api.gouv.fr/open-api-without-deprecated-paths.yml
 */
export type IAPIEntrepriseFondationsRestreintes = IAPIEntrepriseResponse<{
  identifiants: {
    rnf: string;
    siren: string | null;
    siret: string | null;
  };
  identite: {
    service_instructeur: string;
    type_fondation: "FRUP" | "FE" | "FDD";
    denomination: string;
    etat: string;
    date_effet_etat: string | null;
    date_creation: string | null;
    date_terme: string | null;
    date_cloture_exercice: string | null;
    adresse_siege: {
      adresse_complete: string | null;
      numero_voie: string | null;
      nom_voie: string | null;
      code_postal: string | null;
      commune: string | null;
      code_insee_commune: string | null;
      departement: string | null;
      pays: string | null;
    };
    courriel: string | null;
    telephone: string | null;
  };
  activite: {
    objet_social: string;
    domaine_interet_general: string | null;
    activite_internationale_prevue_par_statuts: boolean | null;
  };
  dirigeants: Array<{
    nom?: string | null;
    prenom?: string | null;
    date_naissance?: string | null;
    nationalite?: string | null;
    adresse_domiciliation?: {
      adresse_complete?: string | null;
      code_postal?: string | null;
      commune?: string | null;
      pays?: string | null;
    };
    pays_residence?: string | null;
    profession?: string | null;
    date_entree_fonction?: string | null;
    date_sortie_fonction?: string | null;
    fonction?: string | null;
    qualite?: string | null;
    fondateur?: boolean | null;
    personne_morale?: {
      type?: string | null;
      identifiant?: string | null;
      denomination?: string | null;
      pays?: string | null;
    } | null;
  }>;
  liens_entre_organismes: {
    organisme_issu_transformation: {
      type: string;
      identifiant: string | null;
    } | null;
    organisme_issu_fusion: {
      type: string;
      identifiant: string | null;
    } | null;
    organismes_issus_scission: Array<{
      type?: string;
      identifiant?: string | null;
    }>;
  };
  situation_financiere: {
    annees_subventions_publiques: number[];
    annees_appel_generosite_publique: number[];
    annees_financements_etrangers: number[];
  };
  dossiers: {
    etat_transmission_comptes: "En règle" | "En défaut";
    exercices_comptables_transmis: number[];
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
