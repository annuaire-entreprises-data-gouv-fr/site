import { HttpUnauthorizedError } from '#clients/exceptions';
import routes from '#clients/routes';
import constants from '#models/constants';
import { formatAdresse, Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';

export type IApiEntrepriseAssociation = {
  data: IAPIEntrepriseDataAssociation;
  meta: Meta;
};

export type IAPIEntrepriseDataAssociation = {
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
  adresse_siege: Adresse;
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
    };
    tranche_effectif: {
      code: string;
      intitule: string;
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
    adresse: Adresse;
    activite_principale: {
      code: string;
      libelle: string;
    };
    tranche_effectif: {
      code: string;
      intitule: string;
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
    representant_legaux: {
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
    adresse: Adresse;
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
    type: string;
    sous_type: {
      code: string;
      libelle: string;
    };
    date_depot: string;
    annee_depot: string;
    url: string;
  }[];
};

export type Adresse = {
  complement: string;
  numero_voie: string;
  type_voie: string;
  libelle_voie: string;
  distribution: string;
  code_insee: string;
  code_postal: string;
  commune: string;
};

export type Meta = {
  internal_id: string;
  date_derniere_mise_a_jour_sirene: string;
  date_derniere_mise_a_jour_rna: string;
};

/**
 * GET documents from API Entreprise
 */
export const clientApiEntrepriseAssociation = async (
  siren: Siren,
  useCache = true
) => {
  if (!process.env.API_ENTREPRISE_URL || !process.env.API_ENTREPRISE_TOKEN) {
    throw new HttpUnauthorizedError('Missing API Entreprise credentials');
  }

  const response = await httpGet(
    `${process.env.API_ENTREPRISE_URL}${routes.apiEntreprise.association}${siren}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_ENTREPRISE_TOKEN}`,
      },
      timeout: constants.timeout.XL,
      params: {
        object: 'espace-agent-public',
        context: 'annuaire-entreprises',
        recipient: 13002526500013,
      },
    },
    useCache
  );

  return mapToDomainObject(response.data?.data);
};

const mapToStatuts = (
  documentsRna: IAPIEntrepriseDataAssociation['documents_rna']
) => {
  return documentsRna
    .filter((d) => d.sous_type.code === 'STC')
    .sort((a, b) => parseInt(a.annee_depot, 10) - parseInt(b.annee_depot, 10))
    .map((d) => {
      return {
        annee: d.annee_depot,
        url: d.url,
      };
    });
};

const mapToDac = (
  documentsDac: IAPIEntrepriseDataAssociation['etablissements'][0]['documents_dac'],
  type: string
) => {
  return documentsDac
    .filter((d) => d.type.indexOf(type) === 0)
    .map((d) => {
      return {
        nom: d.nom,
        etat: d.etat,
        commentaire: d.commentaire,
        annee: d.annee_validite,
        url: d.url,
      };
    });
};

const mapToComptes = (
  comptes: IAPIEntrepriseDataAssociation['etablissements'][0]['comptes']
) => {
  return comptes;
};

const mapToDomainObject = (response: IAPIEntrepriseDataAssociation) => {
  const [statuts = null, _rest = null] = mapToStatuts(response.documents_rna);

  return {
    statuts,
    dac: response.etablissements
      .map((e) => {
        return {
          siret: e.siret,
          estSiege: e.siege,
          adresse: formatAdresse({
            complement: e.adresse?.complement,
            numeroVoie: e.adresse?.numero_voie,
            typeVoie: e.adresse?.type_voie,
            libelleVoie: e.adresse?.libelle_voie,
            codePostal: e.adresse?.code_postal,
            libelleCommune: e.adresse?.commune,
            distributionSpeciale: e.adresse?.distribution,
          }),
          comptes: mapToDac(e.documents_dac, 'Comptes'),
          rapportFinancier: mapToDac(e.documents_dac, 'Rapport financier'),
          rapportActivite: mapToDac(e.documents_dac, "Rapport d'activité"),
          exerciceComptable: mapToComptes(e.comptes),
        };
      })
      .map((e) => {
        const hasDocument =
          e.comptes.length > 0 ||
          e.rapportFinancier.length > 0 ||
          e.rapportActivite.length > 0 ||
          e.exerciceComptable.length > 0;
        return { ...e, hasDocument };
      })
      .sort((a, b) => (a.estSiege ? -1 : 1)),
  };
};
