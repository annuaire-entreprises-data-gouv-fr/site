export enum EAdministration {
  INPI = 1,
  INSEE,
  CMAFRANCE,
  DILA,
  METI,
}

export interface IAdministrationsMetaData {
  [key: string]: IAdministrationMetaData;
}
export interface IAdministrationMetaData {
  long: string;
  short: string;
  monitoringSlug: string;
  slug: string;
  adress: string;
  loc: number[];
  description: string;
  contact: string;
  apiGouvLink?: string;
  dataGouvLink?: string;
}

export const administrationsMetaData: IAdministrationsMetaData = {
  [EAdministration.INPI]: {
    slug: 'inpi',
    short: 'INPI',
    long: 'Institut National de la Propriété Intellectuelle (INPI)',
    adress: '15 rue des Minimes - CS50001 92677 Courbevoie Cedex',
    loc: [48.9047703, 2.2606488],
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
    monitoringSlug: 'api-rncs',
  },
  [EAdministration.INSEE]: {
    slug: 'insee',
    short: 'INSEE',
    long:
      'Institut national de la Statistique et des Études Économiques (INSEE)',
    adress: '',
    loc: [],
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
    monitoringSlug: 'api-sirene-insee',
  },
  [EAdministration.DILA]: {
    slug: 'dila',
    short: 'DILA',
    long: 'Direction de l’Information Légale et Administrative (DILA)',
    adress: '',
    loc: [],
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
    dataGouvLink: 'https://www.data.gouv.fr/fr/organizations/premier-ministre/',
    apiGouvLink: 'https://api.gouv.fr/producteurs/dila',
    monitoringSlug: '',
  },
  [EAdministration.METI]: {
    slug: 'meti',
    short: 'METI',
    long: 'Ministère du Travail de l’Emploi et de l’Insertion (METI)',
    adress: '',
    loc: [],
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
    monitoringSlug: 'api-conventions-collectives',
  },
  [EAdministration.CMAFRANCE]: {
    slug: 'cma-france',
    short: 'CMA-France',
    long: 'Chambre des Métiers et de l’Artisnat (CMA-France)',
    adress: '',
    loc: [],
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
    monitoringSlug: 'api-rnm',
  },
};
