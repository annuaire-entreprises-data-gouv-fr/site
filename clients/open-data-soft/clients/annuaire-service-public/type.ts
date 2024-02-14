export type IServicePublicRecord = {
  plage_ouverture: string | null; // "[{"nom_jour_debut": "Lundi", "nom_jour_fin": "Vendredi", "valeur_heure_debut_1": "09:00:00", "valeur_heure_fin_1": "12:00:00", "valeur_heure_debut_2": "13:00:00", "valeur_heure_fin_2": "17:00:00", "commentaire": ""}]",
  site_internet: string | null; // "[{"libelle": "", "valeur": "https://www.france-services.gouv.fr"}]",
  copyright: string | null; // "Direction de l'information légale et administrative (Premier ministre)",
  siren: string | null; // "130025000",
  ancien_code_pivot: string | null; // "msap-38185-03",
  reseau_social: string | null; // "[{"valeur": "https://www.facebook.com/pimmsmediationisere", "description": "", "custom_dico2": "Facebook"}]",
  texte_reference: string | null; // "[{"libelle": "", "valeur": "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047903472"}]"
  partenaire: string | null; // "france_service",
  telecopie: string | null; // "+ (044) 484 16 87"  / "(689) 40 66 23 61" / "+ 687 29 28 76"
  nom: string | null; // "France Services - Grenoble (Itinérant)",
  siret: string | null; // "13002500000010",
  itm_identifiant: string | null; // "1388021",
  sigle: string | null; // "DILA",
  affectation_personne: string | null; // "[{"personne": {"nom": "XXX", "prenom": "xxx", "civilite": "M.", "grade": "", "texte_reference": [{"libelle": "JORF n°0167 du 21 juillet 2023", "valeur": "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047867631"}], "adresse_courriel": []}, "fonction": "Sous-directeur gouvernance, moyens et appui aux projets du service du numérique", "telephone": ""}]"
  date_modification: string | null; // "22/12/2023 10:38:56",
  adresse_courriel: string | null; // "busfs.isere@pimmsmediation.fr",
  service_disponible: string | null;
  organigramme: string | null; // "[{"libelle": " composition du tribunal administratif de Cergy-Pontoise", "valeur": "http://cergy-pontoise.tribunal-administratif.fr/Le-tribunal-administratif/Organisation"}]"
  pivot: string | null; // "[{"type_service_local": "msap", "code_insee_commune": ["38185"]}]",
  partenaire_identifiant: string | null; // "2057",
  ancien_identifiant: string | null;
  id: string | null; // "533cea79-fcee-4186-9b18-c6b3ea08892d",
  ancien_nom: string | null;
  commentaire_plage_ouverture: string | null;
  annuaire: string | null;
  tchat: string | null;
  hierarchie: string | null;
  categorie: string | null; // "SL",
  sve: string | null;
  telephone_accessible: string | null;
  application_mobile: string | null;
  version_type: string | null; // "Publiable",
  type_repertoire: string | null;
  telephone: string | null; // "[{"valeur": "06 65 74 40 30", "description": ""}]",
  version_etat_modification: string | null;
  date_creation: string | null; // "24/02/2022 15:52:40",
  partenaire_date_modification: string | null;
  mission: string | null;
  formulaire_contact: string | null;
  version_source: string | null;
  type_organisme: string | null;
  code_insee_commune: string | null; // "38185",
  statut_de_diffusion: string | null; // "true",
  adresse: string | null; // "[{"type_adresse": "Adresse", "complement1": "Bus France Services Pimms Médiation Grenoble - ZR", "complement2": "", "numero_voie": "97 galerie de l'Arlequin", "service_distribution": "", "code_postal": "38100", "nom_commune": "Grenoble", "pays": "France", "continent": "Europe", "longitude": "5.73261", "latitude": "45.16411", "accessibilite": "", "note_accessibilite": ""}]",
  url_service_public: string | null; // "https://lannuaire.service-public.fr/auvergne-rhone-alpes/isere/533cea79-fcee-4186-9b18-c6b3ea08892d",
  information_complementaire: string | null;
  date_diffusion: string | null;
};
