import { cma, inpi } from '../public/static/logo';

export enum EAdministration {
  INPI = 1,
  INSEE,
  CMAFRANCE,
  DILA,
  METI,
  MI,
}

export interface IAdministrationsMetaData {
  [key: string]: IAdministrationMetaData;
}
export interface IAdministrationMetaData {
  long: string;
  short: string;
  logo?: JSX.Element;
  monitoringId: number;
  slug: string;
  description: string;
  contact: string;
  apiGouvLink?: string;
  apiName?: string;
  dataGouvLink?: string;
  site?: string;
}

interface IAdministrationsLogos {
  [key: string]: JSX.Element;
}

export const administrationsLogo: IAdministrationsLogos = {
  [EAdministration.INPI]: inpi,
  [EAdministration.CMAFRANCE]: cma,
};

export const administrationsMetaData: IAdministrationsMetaData = {
  [EAdministration.INPI]: {
    slug: 'inpi',
    short: 'INPI',
    long: 'Institut National de la Propriété Intellectuelle (INPI)',
    site: 'https://data.inpi.fr',
    description: `## Qu'est-ce que l’INPI ?

L’INPI est l’Institut National de la Protection Intellectuelle. C’est un établissement public à caractère administratif,  qui relève du ministère de l’Économie.

## Quelles sont les données des entreprises publiées par l’INPI ?

Dans le cadre de sa mission historique, l’INPI centralise les données de propriété intellectuelle des entreprises.

- Marques
- Brevets
- Dessins et Modèles

Depuis 2017 et dans le cadre de la loi "Macron", l'INPI publie également les données du Répertoire National du Commerce et des Sociétés

- immatriculations, modifications et radiations des sociétés
- actes et statuts
- comptes annuels non-confidentiels

## Corriger une erreur dans les données

Vous avez repéré une erreur ? Les données de cette administration ne
sont pas à jour ? 👉 [Contactez l’INPI pour demander une correction](https://www.inpi.fr/fr/contactez-nous?about=030).
    `,
    contact: 'https://www.inpi.fr/fr/contactez-nous?about=030',
    dataGouvLink:
      'https://www.data.gouv.fr/fr/organizations/institut-national-de-la-propriete-industrielle-inpi/',
    apiGouvLink: 'https://api.gouv.fr/les-api/api-rncs',
    apiName: 'API Registre National du Commerce et des Sociétés',
    monitoringId: 787859523,
  },
  [EAdministration.INSEE]: {
    slug: 'insee',
    short: 'INSEE',
    site: 'https://www.sirene.fr/sirene/public/accueil',
    long: 'Institut National de la Statistique et des Études Économiques (INSEE)',
    description: `## Qu'est-ce que l’INSEE ?

L’INSEE est l’Institut National de la Statistique et des Études Économiques. C’est une direction générale du ministère des finances.

## Quelles sont les données des entreprises publiées par l’INSEE ?

Dans le cadre de sa mission, l’INSEE a la charge du Système National d'Identification et du Répertoire des Entreprises et de leurs Établissements (SIRENE). Lors de l'enregistrement d’unz nouvelle API au répertoire, sont attribués :

- un numero unique d'identification SIREN (à 9 chiffre) pour l’unité légale
- un numéro unique d'identification SIRET (à 14 chiffres) pour chaque établissement

Sont également enregistrés dans le répertoire :

- l’adresse
- l’activité prinicpale de chaque établissement
- la forme juridique

Les données du répertoire sont remontées par les Centres de Formalités des Entreprises (CFE). Il existe 7 types de CFE, selon le type d'entreprise :

- les greffes des tribunaux de commerce
- les Chambes de Commerce et de l'Industrie (CCI)
- les chambres de métiers et de l'artisanat (CMA)
- les URSSAF
- les centres des impôts
- les chambres d’agriculture
- la chambre nationale de la batellerie artisanale

L'INSEE maintient également les nomenclatures des entreprises :

- les codes APE (Activité Principale Exercée) ou codes NAF
- les codes officiels des communes
- les Professions et Catégories Socio-professionnelles (PCS)

## Corriger une erreur dans les données

Vous avez repéré une erreur ? Les données de cette administration ne
sont pas à jour ?

Certaines mise à jour peuvent être effectuées via [un formulaire en ligne](https://www.service-public.fr/professionnels-entreprises/vosdroits/N31143).

Si ce n'est pas suffisant, [contactez directement l'INSEE](https://www.insee.fr/fr/information/2410945)
    `,
    contact:
      'https://api.insee.fr/catalogue/site/themes/wso2/subthemes/insee/pages/help.jag#contact',
    dataGouvLink:
      'https://www.data.gouv.fr/fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/',
    apiGouvLink: 'https://api.gouv.fr/les-api/sirene_v3',
    apiName: 'API Répertoire Sirene',
    monitoringId: 787859514,
  },
  [EAdministration.DILA]: {
    slug: 'dila',
    short: 'DILA',
    long: 'Direction de l’Information Légale et Administrative (DILA)',
    description: `## Qu'est-ce que la DILA ?

La DILA est la Direction de l'Information Légale et Administrative. C'est une administration publique française.

## Quelles sont les données des entreprises publiées par la DILA ?

Dans le cadre de sa mission, la DILA a la charge de la diffusion des données dont la publication est obligatoire, par la publication au Journal-officiel de la République française et dans les bulletins d'annonces légale :

- actes enregistrés au Registre du Commerce et des Sociétés (RCS) ([BODACC](https://www.bodacc.fr/))
- information financières des entreprises cotées ([info-financière](https://www.info-financiere.fr/))
- annonces des marchés publics ([BOAMP](https://www.boamp.fr/))
- bulletin des conventions collectives ([BOCC](http://www.journal-officiel.gouv.fr/bocc/))

Pour en savoir plus sur le Journal-officiel, 👉 [c'est par ici](https://www.journal-officiel.gouv.fr/)

## Corriger une erreur dans les données

Vous avez repéré une erreur ? Les données de cette administration ne
sont pas à jour ? 👉 [Contactez la DILA pour demander une correction](https://www.dila.premier-ministre.gouv.fr/services/api/boamp/contact).
    `,
    contact:
      'https://www.dila.premier-ministre.gouv.fr/services/api/boamp/contact',
    apiName: 'API BODACC',
    apiGouvLink:
      'https://api.gouv.fr/les-api/api-bulletin-annonces-civiles-commerciales-bodacc',
    dataGouvLink: 'https://www.data.gouv.fr/fr/organizations/premier-ministre/',
    monitoringId: 788647353,
  },
  [EAdministration.METI]: {
    slug: 'meti',
    short: 'METI',
    site: 'https://code.travail.gouv.fr/outils/convention-collective',
    long: 'Ministère du Travail de l’Emploi et de l’Insertion (METI)',
    description: `
## Quelles sont les données des entreprises publiées par le ministère du travail ?

Le ministère du travail publie toutes les conventions collectives enregistrées à la maille SIRET.

## Corriger une erreur dans les données

Vous avez repéré une erreur ? Les données de cette administration ne
sont pas à jour ? 👉 [Contactez le ministère pour demander une correction](https://travail-emploi.gouv.fr/ministere/article/nous-contacter).
        `,
    contact: 'https://travail-emploi.gouv.fr/ministere/article/nous-contacter',
    dataGouvLink:
      'https://www.data.gouv.fr/fr/datasets/liste-des-conventions-collectives-par-entreprise-siret/',
    apiName: 'API Conventions Collectives',
    monitoringId: 787859521,
  },
  [EAdministration.MI]: {
    slug: 'mi',
    short: 'MI',
    long: 'Ministère de l’Intérieur (MI)',
    description: `
## Quelles sont les données des associations publiées par le ministère de l'Intérieur ?

Le ministère de l’interieur publie toutes les données des associations enregistrées dans le [Répertoire National des Associations (RNA)](https://www.associations.gouv.fr/le-rna-repertoire-national-des-associations.html). Le RNA remplace depuis 2010 le répertoire Waldec (Web des associations librement déclarées).

Toutes les associations sont référencées au RNA, mais seule une partie d'entre elles ont un siret et sont enregistrées au répertoire Sirene de l'INSEE.

Les associations doivent demander un siret dans les cas suivants :

- pour demander une subvention
- pour recruter un salarié
- pour développer des activités commerciales

## Corriger une erreur dans les données

Vous avez repéré une erreur ? Les données d’une association ne
sont pas à jour ? 👉 [Contactez le ministère pour demander une correction](https://www.interieur.gouv.fr/Infos-du-site/Nous-contacter).
        `,
    contact: 'https://www.interieur.gouv.fr/Infos-du-site/Nous-contacter',
    apiGouvLink: 'https://api.gouv.fr/les-api/api_rna',
    dataGouvLink:
      'https://www.data.gouv.fr/fr/datasets/repertoire-national-des-associations/',
    apiName: 'API Répertoire National des Associations',
    monitoringId: 788061105,
  },
  [EAdministration.CMAFRANCE]: {
    slug: 'cma-france',
    short: 'CMA-France',
    site: 'https://rnm.artisanat.fr/',
    long: 'Chambre des Métiers et de l’Artisanat (CMA-France)',
    description: `## Qu'est-ce que CMA-France ?

CMA-France est l’organisme fédérateur des Chambres des Métiers et de l'Artisanat en France.

## Quelles sont les données des entreprises publiées par CMA-France ?

Dans le cadre de sa mission, CMA-France a la charge du Répertoire National des Métiers, qui recense tous les artisans.

## Corriger une erreur dans les données

Vous avez repéré une erreur ? Les données de cette administration ne
sont pas à jour ? 👉 [Contactez la Chambre des Métiers et de l'Artisanat de votre département pour demander une correction](http://annuairecma.artisanat.fr/).
    `,
    contact: 'http://annuairecma.artisanat.fr/',
    apiGouvLink: 'https://api.gouv.fr/les-api/api_rnm',
    apiName: 'API Répertoire National des Métiers',
    monitoringId: 787859525,
  },
};
