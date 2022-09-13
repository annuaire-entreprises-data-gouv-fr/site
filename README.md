# Annuaire des Entreprises - [Site web]

[![CI (lint, unit-tests, end2end, a11y)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/pre-merge.yml/badge.svg)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/pre-merge.yml)
[![Deploy - Staging](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/deploy-staging.yml/badge.svg?branch=main)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/deploy-staging.yml)
[![Deploy - Production](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/deploy-production.yml/badge.svg)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/deploy-production.yml)
![Page entreprise](https://img.shields.io/uptimerobot/status/m787859483-e754b64b78a0c30eea102880?label=Page%20entreprise&logo=Page%20entreprise)
![Recherche](https://img.shields.io/uptimerobot/status/m787859512-adcc5cd05674366504f96c86?label=Recherche&logo=Page%20entreprise)

**Statut des APIs utilisées sur le site :**

Pour voir le détail des disponibilités des API utilisées sur le site, [consultez la page de statut](https://annuaire-entreprises.data.gouv.fr/sources-de-donnees).

Ce site est disponible en ligne : [L’Annuaire des Entreprises](https://annuaire-entreprises.data.gouv.fr)

Ce site a pour vocation de mettre à disposition des citoyens et des agents les données ouvertes "Open-data" des entreprises, associations et administrations dotées d'un n° siren/siret.

## Architecture du service 🏗

Ce repository fait partie d'un ensemble de services qui constituent l'[Annuaire des Entreprises](https://annuaire-entreprises.data.gouv.fr) :

| Description                                                                             | Accès                                                                     |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Le site Web                                                                             | [par ici 👉](https://github.com/etalab/annuaire-entreprises-site)         |
| L’API du Moteur de recherche                                                            | [par ici 👉](https://github.com/etalab/annuaire-entreprises-search-api)   |
| L‘API de redondance de Sirene                                                           | [par ici 👉](https://github.com/etalab/annuaire-entreprises-sirene-api)   |
| Le traitement permettant la génération de données à ingérer dans le moteur de recherche | [par ici 👉](https://github.com/etalab/annuaire-entreprises-search-infra) |
| L’API de proxy du RNCS                                                                  | [par ici 👉](https://github.com/etalab/rncs-api-proxy)                    |

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

# Lancer le site en prod
export PORT=3000
npm run build && npm run start
```

### Tests

1. Linter

```bash
npm run lint
```

2. Tests unitaires

```bash
npm run test:unit
```

3. Tests end2end

```bash
npm run test:end2end
```

4. SEO (Sitemap generation)

```bash
npm run sitemap
```

### Deploiement

Le déploiement se fait par [Github action](https://github.com/etalab/annuaire-entreprises-site/actions)

A chaque "merge" sur master :

- Laissez le déploiement se faire automatiquement sur [staging](https://staging.annuaire-entreprises.data.gouv.fr) via l'action [deploy-staging](https://github.com/etalab/annuaire-entreprises-site/actions/workflows/deploy-staging.yml)
- Vérifiez vos changements sur [staging](https://staging.annuaire-entreprises.data.gouv.fr)
- Lancez manuellement le déploiement sur [production](https://annuaire-entreprises.data.gouv.fr) : sur [deploy-production](https://github.com/etalab/annuaire-entreprises-site/actions/workflows/deploy-production.yml) et cliquez sur "Run workflow" -> "Run workflow"

NB: Si plusieurs déploiements sont déclenchés en même temps, seul le premier va jusqu'au bout. Les autres sont automatiquement interrompus.

## Sitemap

La sitemap est générée deux fois par mois par une github action. Elle est ensuite stockée dans un artifact et téléchargée lors du déploiement sur les différents environnements.

## Licence

Ce projet est sous AGPL 3.0
