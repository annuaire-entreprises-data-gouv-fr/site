import { IAPIEntrepriseResponse } from '../client';

export type IAPIEntrepriseLiensCapitalistiques = IAPIEntrepriseResponse<{
  capital: {
    actionnaires: Array<{
      type: 'personne_physique' | 'personne_morale';
      pourcentage: number;
      nombre_parts: number;
      personne_physique_attributes?: {
        civilite: string;
        nom_patronymique_et_prenoms: string;
        nom_marital: string;
        date_naissance: {
          annee: string;
          mois: string;
        };
      };
      personne_morale_attributes?: {
        siren: string;
        denomination: string;
        complement_denomination?: string;
        forme_juridique: string;
      };
      adresse: {
        numero: string;
        voie: string;
        lieu_dit_hameau?: string;
        code_postal: string;
        ville: string;
        pays: string;
      };
    }>;
    repartition: {
      personnes_physiques: {
        total_actions: number;
        nombre: number;
      };
      personnes_morales: {
        total_actions: number;
        nombre: number;
      };
    };
    depose_neant: boolean;
  };
  participations: {
    filiales: Array<{
      siren: string;
      denomination: string;
      complement_denomination?: string;
      forme_juridique: string;
      pourcentage_detention: number;
      adresse: {
        numero: string;
        voie: string;
        lieu_dit_hameau?: string;
        code_postal: string;
        ville: string;
        pays: string;
      };
    }>;
    nombre_filiales: number;
    depose_neant: boolean;
  };
}>;
