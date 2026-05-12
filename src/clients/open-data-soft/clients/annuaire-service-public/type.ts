export interface IServicePublicRecord {
  adresse: string | null; // "[{"type_adresse": "Adresse", "complement1": "Bus France Services Pimms Médiation Grenoble - ZR", "complement2": "", "numero_voie": "97 galerie de l'Arlequin", "service_distribution": "", "code_postal": "38100", "nom_commune": "Grenoble", "pays": "France", "continent": "Europe", "longitude": "5.73261", "latitude": "45.16411", "accessibilite": "", "note_accessibilite": ""}]",
  adresse_courriel: string | null; // "busfs.isere@pimmsmediation.fr",
  affectation_personne: string | null; // "[{"personne": {"nom": "XXX", "prenom": "xxx", "civilite": "M.", "grade": "", "texte_reference": [{"libelle": "JORF n°0167 du 21 juillet 2023", "valeur": "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047867631"}], "adresse_courriel": []}, "fonction": "Sous-directeur gouvernance, moyens et appui aux projets du service du numérique", "telephone": ""}]"
  ancien_code_pivot: string | null; // "msap-38185-03",
  ancien_identifiant: string | null;
  ancien_nom: string | null;
  annuaire: string | null;
  application_mobile: string | null;
  categorie: string | null; // "SL",
  code_insee_commune: string | null; // "38185",
  commentaire_plage_ouverture: string | null;
  copyright: string | null; // "Direction de l'information légale et administrative (Premier ministre)",
  date_creation: string | null; // "24/02/2022 15:52:40",
  date_diffusion: string | null;
  date_modification: string | null; // "22/12/2023 10:38:56",
  formulaire_contact: string | null;
  hierarchie: string | null;
  id: string | null; // "533cea79-fcee-4186-9b18-c6b3ea08892d",
  information_complementaire: string | null;
  itm_identifiant: string | null; // "1388021",
  mission: string | null;
  nom: string | null; // "France Services - Grenoble (Itinérant)",
  organigramme: string | null; // "[{"libelle": " composition du tribunal administratif de Cergy-Pontoise", "valeur": "http://cergy-pontoise.tribunal-administratif.fr/Le-tribunal-administratif/Organisation"}]"
  partenaire: string | null; // "france_service",
  partenaire_date_modification: string | null;
  partenaire_identifiant: string | null; // "2057",
  pivot: string | null; // "[{"type_service_local": "msap", "code_insee_commune": ["38185"]}]",
  plage_ouverture: string | null; // "[{"nom_jour_debut": "Lundi", "nom_jour_fin": "Vendredi", "valeur_heure_debut_1": "09:00:00", "valeur_heure_fin_1": "12:00:00", "valeur_heure_debut_2": "13:00:00", "valeur_heure_fin_2": "17:00:00", "commentaire": ""}]",
  reseau_social: string | null; // "[{"valeur": "https://www.facebook.com/pimmsmediationisere", "description": "", "custom_dico2": "Facebook"}]",
  service_disponible: string | null;
  sigle: string | null; // "DILA",
  siren: string | null; // "130025000",
  siret: string | null; // "13002500000010",
  site_internet: string | null; // "[{"libelle": "", "valeur": "https://www.france-services.gouv.fr"}]",
  statut_de_diffusion: string | null; // "true",
  sve: string | null;
  tchat: string | null;
  telecopie: string | null; // "+ (044) 484 16 87"  / "(689) 40 66 23 61" / "+ 687 29 28 76"
  telephone: string | null; // "[{"valeur": "06 65 74 40 30", "description": ""}]",
  telephone_accessible: string | null;
  texte_reference: string | null; // "[{"libelle": "", "valeur": "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047903472"}]"
  type_organisme: string | null;
  type_repertoire: string | null;
  url_service_public: string | null; // "https://lannuaire.service-public.gouv.fr/auvergne-rhone-alpes/isere/533cea79-fcee-4186-9b18-c6b3ea08892d",
  version_etat_modification: string | null;
  version_source: string | null;
  version_type: string | null; // "Publiable",
}
