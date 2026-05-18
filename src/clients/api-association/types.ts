export interface IAssociationResponse {
  activites?: Activites;
  adherent_personne_morale?: AdherentPersonneMorale[];
  agrement?: Agrement[];
  commentaire?: Commentaire;
  compte: Compte[];
  coordonnees?: Coordonnees;
  document_dac: any[];
  document_rna: any[];
  etablissement?: Etablissement[];
  identite: Identite;
  nbDocDac: number;
  nbDocRna: number;
  nbEtabsActifs: number;
  representant_legal: any[];
  reseau_affiliation?: ReseauAffiliation[];
  rh?: Rh[];
  rib: any[];
}

export interface IAssociationPartenairesResponse {
  asso: Omit<IAssociationResponse, "etablissement"> & {
    etablissements?: {
      etablissement: Etablissement[] | Etablissement;
    };
    agrements?: {
      agrement: Agrement[] | Agrement;
    };
    comptes?: {
      compte: Compte[] | Compte;
    };
  };
}

interface Identite {
  active: boolean;
  active_sirene: boolean;
  date_creat: string;
  date_creation_sirene: string;
  date_dissolution: string;
  date_modif_rna: string;
  date_modif_siren: string;
  date_pub_jo: string;
  eligibilite_cec: boolean;
  groupement: string;
  id_correspondance: number;
  id_ex: string;
  id_forme_juridique: number;
  id_rna: string;
  id_siren: string;
  id_siret_siege: string;
  impots_commerciaux: boolean;
  lib_forme_juridique: string;
  nature: string;
  nom: string;
  nom_sirene: string;
  regime: string;
  sigle: string;
  sigle_sirene: string;
  util_publique: boolean;
}

interface Activites {
  annee_activite_principale: number;
  annee_effectif_salarie_cent: number;
  appartenance_ess: string;
  champ_action_territorial: string;
  domaine: string;
  effectif_salarie_cent: number;
  id_activite_principale: string;
  id_famille1: string;
  id_objet_social1: string;
  id_objet_social2: string;
  id_theme1: string;
  id_tranche_effectif: string;
  lib_activite_principale: string;
  lib_famille1: string;
  lib_objet_social1: string;
  lib_theme1: string;
  lib_tranche_effectif: string;
  objet: string;
}

interface Coordonnees {
  adresse_gestion: AdresseGestion;
  adresse_siege: AdresseSiege;
  adresse_siege_sirene: AdresseSiegeSirene;
  courriel: string;
  site_web: string;
  telephone: string;
}

interface AdresseSiege {
  code_insee: string;
  commune: string;
  cp: string;
  cplt_3: string;
  num_voie: string;
  type_voie: string;
  voie: string;
}

interface AdresseGestion {
  commune: string;
  cp: string;
  cplt_3: string;
  pays: string;
  voie: string;
}

interface AdresseSiegeSirene {
  code_insee: string;
  commune: string;
  cp: string;
  cplt_3: string;
  num_voie: string;
  type_voie: string;
  voie: string;
}

interface Commentaire {
  note: string;
}

interface ReseauAffiliation {
  adresse: Adresse;
  id_correspondance: number;
  id_rna: string;
  id_siret: string;
  nb_licencies: number;
  nb_licencies_f: number;
  nb_licencies_h: number;
  nom: string;
  objet: string;
}

interface Adresse {
  commune: string;
  cp: string;
  cplt_3: string;
  num_voie: string;
  type_voie: string;
  voie: string;
}

interface AdherentPersonneMorale {
  id: number;
  nom: string;
}

interface Rh {
  annee: number;
  id_siret: string;
  nb_adherents: number;
  nb_adherents_f: number;
  nb_adherents_h: number;
  nb_benevoles: number;
  nb_emplois_aides: number;
  nb_personnels_detaches: number;
  nb_salaries: number;
  nb_salaries_etpt: number;
  nb_volontaires: number;
}

interface Agrement {
  attributeur: string;
  date_attribution: string;
  id: number;
  niveau: string;
  numero: string;
  type: string;
}

interface Compte {
  aides_3ans: number; //72110;
  annee: number; //2019;
  charges: number; //230274;
  dons: number; //6904;
  id: number; //39562;
  id_siret: number | string; //'77567227221138';
  produits: number; //250305;
  resultat: number; //20031;
  subv: number; //63523;
  subv_cause: string; //'interet departemental des actions sociales et de santé';
}

interface Etablissement {
  actif: boolean;
  adresse: Adresse2;
  annee_activite_principale: number;
  annee_effectif_salarie_cent: number;
  date_actif: string;
  effectif_salarie_cent: number;
  est_siege: boolean;
  id_activite_principale: string;
  id_siren: string;
  id_siret: string;
  id_tranche_effectif: string;
  lib_activite_principale: string;
  lib_tranche_effectif: string;
}

interface Adresse2 {
  code_insee: string;
  commune: string;
  cp: string;
  cplt_1: string;
  num_voie: string;
  type_voie: string;
  voie: string;
}
