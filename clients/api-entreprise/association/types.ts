import { IAPIEntrepriseResponse } from '../client';

export type IAPIEntrepriseAssociation = IAPIEntrepriseResponse<{
  rna: string;
  ancien_id: string;
  siren: string;
  nom: string;
  active: boolean;
  sigle: string;
  reconnue_utilite_publique: boolean;
  siret_siege: string;
  forme_juridique: {
    code: string;
    libelle: string;
  };
  regime: string;
  groupement: string;
  eligibilite_cec: boolean;
  raison_non_eligibilite_cec: string;
  impots_commerciaux: boolean;
  date_creation: string;
  date_dissolution: string;
  date_publication_reconnue_utilite_publique: string;
  date_publication_journal_officiel: string;
  adresse_siege: {
    complement: string;
    numero_voie: string;
    type_voie: string;
    libelle_voie: string;
    distribution: string;
    code_insee: string;
    code_postal: string;
    commune: string;
  };
  adresse_gestion: {
    complement: string;
    numero_voie: string;
    type_voie: string;
    libelle_voie: string;
    distribution: string;
    code_insee: string;
    code_postal: string;
    commune: string;
  };
  alsace_moselle: {
    tribunal_instance: string;
    volume: string;
    folio: string;
    date_publication_registre_association: string;
  };
  composition_reseau: {
    nom: string;
    rna: string;
    siret: string;
    telephone: string;
    courriel: string;
    objet: string;
    adresse: {
      complement: string;
      numero_voie: string;
      type_voie: string;
      libelle_voie: string;
      distribution: string;
      code_insee: string;
      code_postal: string;
      commune: string;
    };
    site_web: string;
  }[];
  agrements: {
    numero: string;
    date_attribution: string;
    type: string;
    niveau: string;
    attributeur: string;
    url: string;
  }[];
  activites: {
    objet: string;
    objet_social1: {
      code: string;
      libelle: string;
    };
    objet_social2: {
      code: string;
      libelle: string;
    };
    champ_action_territorial: string;
    activite_principale: {
      code: string;
      libelle: string;
      annee: string;
    };
    tranche_effectif: {
      code: string;
      libelle: string;
      annee: string;
    };
    economie_sociale_et_solidaire: boolean;
    date_appartenance_ess: string;
  };
  etablissements: {
    siren: string;
    siret: string;
    actif: boolean;
    siege: boolean;
    nom: string;
    telephone: string;
    courriel: string;
    date_debut_activite: string;
    adresse: {
      complement: string;
      numero_voie: string;
      type_voie: string;
      libelle_voie: string;
      distribution: string;
      code_insee: string;
      code_postal: string;
      commune: string;
    };
    activite_principale: {
      code: string;
      libelle: string;
    };
    tranche_effectif: {
      code: string;
      libelle: string;
    };
    rhs: {
      annee: string;
      nombre_benevoles: number;
      nombre_volontaires: number;
      nombre_salaries: number;
      nombre_salaries_etpt: number;
      nombre_emplois_aides: number;
      nombre_personnels_detaches: number;
      nombre_adherents: {
        hommes: number;
        femmes: number;
        total: number;
      };
    }[];
    comptes: {
      annee: string;
      commisaire_aux_comptes: boolean;
      montant_dons: number;
      cause_subventions: string;
      montant_subventions: number;
      montant_aides_sur_3ans: number;
      total_charges: number;
      total_resultat: number;
      total_produits: number;
    }[];
    representants_legaux: {
      civilite: string;
      nom: string;
      prenom: string;
      fonction: string;
      valideur_cec: boolean;
      publication_internet: boolean;
      telephone: string;
      courriel: string;
    }[];
    documents_dac: {
      id: string;
      nom: string;
      annee_validite: string;
      commentaire: string;
      etat: string;
      type: string;
      date_depot: string;
      url: string;
    }[];
  }[];
  reseaux_affiliation: {
    nom: string;
    numero: string;
    rna: string;
    siret: string;
    objet: string;
    adresse: {
      complement: string;
      numero_voie: string;
      type_voie: string;
      libelle_voie: string;
      distribution: string;
      code_insee: string;
      code_postal: string;
      commune: string;
    };
    telephone: string;
    courriel: string;
    attestation_affiliation_url: string;
    nombre_licencies: {
      hommes: number;
      femmes: number;
      total: number;
    };
  }[];
  documents_rna: {
    id: string;
    type: string;
    sous_type: {
      code: string;
      libelle: string;
    };
    date_depot: string;
    annee_depot: string;
    url: string;
  }[];
}>;
