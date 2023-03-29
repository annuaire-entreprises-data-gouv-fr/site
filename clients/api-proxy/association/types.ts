export type IAssociationResponse = {
  identite: Identite;
  activites?: Activites;
  coordonnees?: Coordonnees;
  commentaire?: Commentaire;
  nbDocDac: number;
  nbDocRna: number;
  nbEtabsActifs: number;
  reseau_affiliation?: ReseauAffiliation[];
  adherent_personne_morale?: AdherentPersonneMorale[];
  representant_legal: any[];
  rh?: Rh[];
  agrement?: Agrement[];
  compte: any[];
  etablissement?: Etablissement[];
  rib: any[];
  document_dac: any[];
  document_rna: any[];
};

type Identite = {
  nom: string;
  nom_sirene: string;
  sigle: string;
  sigle_sirene: string;
  id_rna: string;
  id_ex: string;
  id_siren: string;
  id_siret_siege: string;
  id_correspondance: number;
  id_forme_juridique: number;
  lib_forme_juridique: string;
  date_pub_jo: string;
  date_creat: string;
  date_creation_sirene: string;
  date_dissolution: string;
  date_modif_rna: string;
  date_modif_siren: string;
  active: boolean;
  active_sirene: boolean;
  nature: string;
  util_publique: boolean;
  groupement: string;
  eligibilite_cec: boolean;
  regime: string;
  impots_commerciaux: boolean;
};

type Activites = {
  objet: string;
  domaine: string;
  id_objet_social1: string;
  lib_objet_social1: string;
  id_famille1: string;
  lib_famille1: string;
  id_theme1: string;
  lib_theme1: string;
  id_objet_social2: string;
  id_activite_principale: string;
  lib_activite_principale: string;
  annee_activite_principale: number;
  champ_action_territorial: string;
  id_tranche_effectif: string;
  lib_tranche_effectif: string;
  effectif_salarie_cent: number;
  annee_effectif_salarie_cent: number;
  appartenance_ess: string;
};

type Coordonnees = {
  telephone: string;
  courriel: string;
  adresse_siege: AdresseSiege;
  adresse_gestion: AdresseGestion;
  site_web: string;
  adresse_siege_sirene: AdresseSiegeSirene;
};

type AdresseSiege = {
  cplt_3: string;
  num_voie: string;
  voie: string;
  commune: string;
  code_insee: string;
  cp: string;
  type_voie: string;
};

type AdresseGestion = {
  cplt_3: string;
  voie: string;
  commune: string;
  cp: string;
  pays: string;
};

type AdresseSiegeSirene = {
  cplt_3: string;
  num_voie: string;
  voie: string;
  commune: string;
  code_insee: string;
  cp: string;
  type_voie: string;
};

type Commentaire = {
  note: string;
};

type ReseauAffiliation = {
  nom: string;
  objet: string;
  adresse: Adresse;
  id_correspondance: number;
  id_rna: string;
  id_siret: string;
  nb_licencies: number;
  nb_licencies_h: number;
  nb_licencies_f: number;
};

type Adresse = {
  cplt_3: string;
  num_voie: string;
  voie: string;
  commune: string;
  cp: string;
  type_voie: string;
};

type AdherentPersonneMorale = {
  id: number;
  nom: string;
};

type Rh = {
  nb_benevoles: number;
  nb_volontaires: number;
  nb_salaries: number;
  nb_salaries_etpt: number;
  id_siret: string;
  nb_emplois_aides: number;
  nb_personnels_detaches: number;
  nb_adherents: number;
  nb_adherents_h: number;
  nb_adherents_f: number;
  annee: number;
};

type Agrement = {
  type: string;
  numero: string;
  niveau: string;
  attributeur: string;
  id: number;
  date_attribution: string;
};

type Etablissement = {
  actif: boolean;
  adresse: Adresse2;
  id_siret: string;
  id_siren: string;
  est_siege: boolean;
  date_actif: string;
  id_activite_principale: string;
  lib_activite_principale: string;
  annee_activite_principale: number;
  effectif_salarie_cent: number;
  annee_effectif_salarie_cent: number;
  id_tranche_effectif: string;
  lib_tranche_effectif: string;
};

type Adresse2 = {
  num_voie: string;
  voie: string;
  commune: string;
  code_insee: string;
  cp: string;
  cplt_1: string;
  type_voie: string;
};
