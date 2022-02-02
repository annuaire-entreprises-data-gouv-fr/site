# Annuaire des Entreprises - le site

[![Pre-merge checks](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/pre-merge.yml/badge.svg)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/pre-merge.yml)
[![Accessibilité](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/check-a11y.yml/badge.svg)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/check-a11y.yml)
[![Proxy PDF de l’extrait d’immatriculation INPI](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/check-inpi-pdf-proxy.yml/badge.svg)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/check-inpi-pdf-proxy.yml)

Ce site est disponible en ligne : [L’Annuaire des Entreprises](https://annuaire-entreprises.data.gouv.fr)

Ce site a pour vocation de mettre à disposition des citoyens et des agents les données ouvertes "Open-data" des entreprises, associations et administrations présentes dans la base SIRENE.

## Architecture du service 🏗

Ce repository fait partie d'un ensemble de services qui ensemble constituent l'[Annuaire des Entreprises](https://annuaire-entreprises.data.gouv.fr) :

| Description | Accès |
|-|-|
|Site | [par ici 👉](https://github.com/etalab/annuaire-entreprises-site) |
|API du Moteur de recherche | [par ici 👉](https://github.com/etalab/annuaire-entreprises-search-api) |
|API de redondance de Sirene | [par ici 👉](https://github.com/etalab/annuaire-entreprises-sirene-api) |

## Etat des lieux 🤓

**Déploiement**

[![Deploy - Staging](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/deploy-staging.yml/badge.svg?branch=main)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/deploy-staging.yml)

[![Deploy - Production](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/deploy-production.yml/badge.svg)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/deploy-production.yml)

**Statut du site :**

![Page entreprise](https://img.shields.io/uptimerobot/status/m787859483-e754b64b78a0c30eea102880?label=Page%20entreprise&logo=Page%20entreprise)
![Recherche](https://img.shields.io/uptimerobot/status/m787859512-adcc5cd05674366504f96c86?label=Recherche&logo=Page%20entreprise)

**Statut des APIs utilisées sur le site :**

Pour voir le détail des disponibilités des API utilisées sur le site, [consultez la page de statut](https://annuaire-entreprises.data.gouv.fr/administration).

## A propos des choix d'architecture

Ce site utilise Next.js de manière modifiée :

- en developpement, next.js tourne de manière normale.
- en production, la ré-hydratation de react dans le navigateur est désactivée. Next.js se comporte comme un framework de rendu serveur traditionnel.

Pourquoi désactiver la ré-hydratation ? Par soucis d'inclusivité et de frugalité :

1. Le site peut fonctionner en mode dégradé sans javascript
2. Les pages du site sont beaucoup, beaucoup, beaucoup plus légères, ce qui avec un bon débit donne le même confort qu'une SPA, et avec un mauvais débit est plus utilisable q'une SPA

Dans ce cas pourquoi utiliser Next.js ? Pour bénéficier de l'écosystème, de l'outillage dev (HotReload en local, typescript) et pour des raisons de compétences et de préférences.

## Installation

```bash
# Installation
npm i

# Lancer le site en dev
npm run dev

# Lancer le site en prod sans la sitemap
export PORT=3000
npm run build:site && npm run start

```

## Licence

Ce projet est sous AGPL 3.0
